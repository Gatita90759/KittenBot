const { SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nivel")
        .setDescription("Muestra tu nivel actual"),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        const key = `level_${guildId}_${userId}`;

        let userData = await db.get(key) || { xp: 0, level: 1 };

        await interaction.reply(`📊 **${interaction.user.username}**, estás en el nivel **${userData.level}** con **${userData.xp} XP**.`);
    },
};