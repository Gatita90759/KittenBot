const Level = require('../models/level.js');
const { calculateNextLevelXP } = require('./levelCard.js');
const levelConfig = require('../config/levelConfig.js');

async function addXP(userId, guildId, user) {
  let amount = Math.floor(
    Math.random() * (levelConfig.xp.max - levelConfig.xp.min + 1) + levelConfig.xp.min
  );
  
  // Bonificaciones por actividad
  const hour = new Date().getHours();
  if (hour >= 22 || hour <= 6) amount *= 1.5; // Bonus nocturno
  
  // Bonus por días consecutivos de actividad
  if (userLevel.dailyStreak > 0) {
    amount *= (1 + (userLevel.dailyStreak * 0.1)); // 10% extra por día consecutivo
  }
  
  // Bonus por eventos especiales (fines de semana)
  if (new Date().getDay() === 6 || new Date().getDay() === 0) {
    amount *= 2; // Doble XP en fines de semana
  }
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