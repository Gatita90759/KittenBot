const { SlashCommandBuilder } = require("discord.js");
const QuickDB = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clasificacion")
        .setDescription("Muestra la clasificación de los usuarios con más nivel"),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const allUsers = await db.all();

        const leaderboard = allUsers
            .filter(entry => entry.id.startsWith(`level_${guildId}_`))
            .map(entry => ({
                id: entry.id.split("_")[2],
                level: entry.value.level || 1,
                xp: entry.value.xp || 0
            }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .slice(0, 10); // Los primeros 10 usuarios

        if (leaderboard.length === 0) {
            return interaction.reply("No hay datos en la clasificación aún.");
        }

        let ranking = leaderboard
            .map((user, index) => `**${index + 1}.** <@${user.id}> - Nivel **${user.level}** (${user.xp} XP)`)
            .join("\n");

        await interaction.reply(`🏆 **Clasificación del servidor:**\n\n${ranking}`);
    }
};