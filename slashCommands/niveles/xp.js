
const QuickDB = require("quick.db");
const db = new QuickDB();
const cooldowns = new Map(); // Para evitar spam de XP

module.exports = async (message) => {
  // Ignorar mensajes de bots y DMs
  if (message.author.bot || !message.guild) return;
  
  const userId = message.author.id;
  const guildId = message.guild.id;
  const key = `level_${guildId}_${userId}`;
  
  // Sistema de cooldown (1 minuto)
  const now = Date.now();
  const cooldownTime = 60000; // 1 minuto en milisegundos
  
  if (cooldowns.has(userId)) {
    const lastTime = cooldowns.get(userId);
    if (now - lastTime < cooldownTime) return;
  }
  
  // Actualizar cooldown
  cooldowns.set(userId, now);
  
  // Obtener datos del usuario o crear nuevos si no existen
  let userData = await db.get(key) || { xp: 0, level: 1 };
  
  // Añadir XP aleatorio (entre 10 y 25)
  const xpToAdd = Math.floor(Math.random() * 16) + 10;
  userData.xp += xpToAdd;
  
  // Calcular XP necesario para subir de nivel (fórmula: 100 * nivel actual)
  const xpNeeded = userData.level * 100;
  
  // Subir de nivel si tiene suficiente XP
  if (userData.xp >= xpNeeded) {
    userData.level++;
    userData.xp = 0; // Reinicia XP al subir de nivel
    
    message.channel.send(`🎉 ¡${message.author.username} ha subido al nivel ${userData.level}!`);
  }
  
  // Guardar datos actualizados
  await db.set(key, userData);
}a);
};
