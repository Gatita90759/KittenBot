
const Canvas = require('canvas');
// Para q se haga la tarjeta
async function generateLevelCard(user, levelData) {
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');


  // Fondo
  ctx.fillStyle = '#36393f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Avatar
  const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'png' }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(125, 125, 75, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 50, 50, 150, 150);
  ctx.restore();

  // Usuario y nivel
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(user.username, 230, 100);
  ctx.font = '25px sans-serif';
  ctx.fillText(`Nivel: ${levelData.level}`, 230, 140);

  // Barra de progreso
  const nextLevel = calculateNextLevelXP(levelData.level);
  const progress = (levelData.xp / nextLevel) * 100;

  ctx.fillStyle = '#484b4e';
  ctx.fillRect(230, 160, 420, 25);
  ctx.fillStyle = '#5865f2';
  ctx.fillRect(230, 160, (420 * progress) / 100, 25);

  // XP texto
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`${levelData.xp}/${nextLevel} XP`, 230, 210);

  return canvas.toBuffer();
}

function calculateNextLevelXP(level) {
  return Math.floor(100 * (Math.pow(1.5, level)) + 50 * level);
}

module.exports = { generateLevelCard, calculateNextLevelXP };

