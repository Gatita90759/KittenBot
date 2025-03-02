
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clasificacion")
        .setDescription("Muestra la clasificación de niveles del servidor"),
    async execute(interaction) {
        await interaction.deferReply(); // Usamos defer porque puede tardar

        const guildId = interaction.guild.id;
        const keys = await db.all();
        
        // Filtrar solo claves relacionadas con niveles de este servidor
        const levelKeys = keys.filter(item => item.id.startsWith(`level_${guildId}_`));
        
        if (levelKeys.length === 0) {
            return interaction.editReply("Aún no hay usuarios con niveles en este servidor.");
        }

        // Ordenar por nivel y XP
        const sortedUsers = levelKeys.sort((a, b) => {
            if (a.value.level !== b.value.level) {
                return b.value.level - a.value.level;
            }
            return b.value.xp - a.value.xp;
        });

        // Limitar a los 10 primeros
        const top10 = sortedUsers.slice(0, 10);

        // Crear el embed
        const embed = new EmbedBuilder()
            .setTitle("🏆 Clasificación de Niveles")
            .setDescription("Los miembros con mayor nivel en el servidor")
            .setColor(0xFFD700)
            .setTimestamp();

        // Agregar cada usuario al embed
        for (let i = 0; i < top10.length; i++) {
            const userId = top10[i].id.split('_')[2];
            const userData = top10[i].value;
            
            try {
                const user = await interaction.client.users.fetch(userId);
                embed.addFields({
                    name: `${i + 1}. ${user.username}`,
                    value: `Nivel: ${userData.level} | XP: ${userData.xp}/${userData.level * 100}`,
                    inline: false
                });
            } catch (error) {
                console.error(`No se pudo obtener el usuario ${userId}:`, error);
                embed.addFields({
                    name: `${i + 1}. Usuario Desconocido`,
                    value: `Nivel: ${userData.level} | XP: ${userData.xp}/${userData.level * 100}`,
                    inline: false
                });
            }
        }

        await interaction.editReply({ embeds: [embed] });
    }
};
