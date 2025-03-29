const Level = require('../models/level.js');
const { calculateNextLevelXP } = require('./levelCard.js');
const levelConfig = require('../config/levelConfig.js');

async function addXP(userId, guildId, user) {
  const amount = Math.floor(
    Math.random() * (levelConfig.xp.max - levelConfig.xp.min + 1) + levelConfig.xp.min
  );
  let userLevel = await Level.findOne({ userID: userId, guildID: guildId });

  if (!userLevel) {
    userLevel = await Level.create({
      userID: userId,
      guildID: guildId
    });
  }

  userLevel.xp += amount;
  const nextLevelXP = calculateNextLevelXP(userLevel.level);

  if (userLevel.xp >= nextLevelXP) {
    userLevel.level += 1;
    userLevel.xp = 0;
    await userLevel.save();
    return { levelUp: true, newLevel: userLevel.level };
  }

  await userLevel.save();
  return { levelUp: false, newLevel: userLevel.level };
}

module.exports = { addXP };