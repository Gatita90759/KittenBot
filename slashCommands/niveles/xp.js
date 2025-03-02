
const QuickDB = require("quick.db");
const db = new QuickDB();
const cooldowns = new Map(); // Para evitar spam de XP

module.exports = async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const guildId = message.guild.id;
    const key = `level_${guildId}_${userId}`;

    // Cooldown de 1 minuto para cada usuario
    if (cooldowns.has(userId)) {
        const lastXP = cooldowns.get(userId);
        if (Date.now() - lastXP < 60000) return;
    }
    cooldowns.set(userId, Date.now());

    // Obtener datos actuales
    let userData = await db.get(key) || { xp: 0, level: 1 };

    // Agregar XP aleatorio entre 5 y 15
    let xpGained = Math.floor(Math.random() * 11) + 5;
    userData.xp += xpGained;

    // Sistema de nivel (cada 100 XP sube de nivel)
    let nextLevelXP = userData.level * 100;
    if (userData.xp >= nextLevelXP) {
        userData.level++;
        userData.xp = 0; // Reinicia XP al subir de nivel

        message.channel.send(`🎉 ¡${message.author.username} ha subido al nivel ${userData.level}!`);
    }

    // Guardar datos actualizados
    await db.set(key, userData);
};
