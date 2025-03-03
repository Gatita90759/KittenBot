
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../config.js");

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

    // Usar una fórmula para hacer más difícil el siguiente nivel
    let nextLevelXP = Math.floor(100 * Math.pow(userData.level, 1.5));  // XP requerido para subir de nivel

    // Si el usuario supera el XP necesario para el siguiente nivel
    if (userData.xp >= nextLevelXP) {
        userData.level++;
        userData.xp = 0; // Reinicia XP al subir de nivel

        message.channel.send(`¡${message.author.username} ha subido al nivel ${userData.level} \<a:monitograciosobailandocumbia:1337809456465182790> !`);

        // Otorgar rol si hay recompensa definida en config.json
        const rewardRoleId = config.rewards[userData.level];
        if (rewardRoleId) {
            const role = message.guild.roles.cache.get(rewardRoleId);
            const member = message.guild.members.cache.get(userId);
            if (role && member) {
                await member.roles.add(role);
                message.channel.send(`¡${message.author.username} ha recibido el rol **${role.name}** por llegar a nivel ${userData.level} \<:waos:1332156890930479144> !`);
            }
        }
    }

    await db.set(key, userData);
};