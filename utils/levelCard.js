
const Canvas = require('canvas');
// Para q se haga la tarjeta
async function generateLevelCard(user, levelData) {
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');


  // Colores personalizables
  const colors = {
    background: '#2C2F33',     // Color de fondo
    progress: '#FF69B4',       // Color de la barra de progreso
    progressBg: '#484b4e',     // Color del fondo de la barra
    text: '#FFC0CB'           // Color del texto
  };

  // Fondo con gradiente
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, colors.background);
  gradient.addColorStop(1, '#23272A');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Avatar con borde
  ctx.save();
  ctx.beginPath();
  ctx.arc(125, 125, 80, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colors.progress;
  ctx.stroke();
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'png' }));
  ctx.drawImage(avatar, 45, 45, 160, 160);
  ctx.restore();

  // Usuario y nivel con nuevo estilo
  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = colors.text;
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
  // Puedes ajustar estos valores según quieras que sea de difícil subir de nivel
  const baseXP = 100;           // XP base
  const multiplier = 1.8;       // Qué tan rápido aumenta la dificultad
  const additional = 75;        // XP adicional por nivel

  return Math.floor(baseXP * (Math.pow(multiplier, level)) + additional * level);
}

module.exports = { generateLevelCard, calculateNextLevelXP };

