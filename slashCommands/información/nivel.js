
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { obtenerDatos } = require('../../utils/simpleXP');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nivel')
    .setDescription('Ver tu nivel actual'),
    
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    
    // Obtener datos del usuario
    const datos = await obtenerDatos(guildId, userId);
    
    // Calcular XP necesario para siguiente nivel
    const xpNecesario = datos.nivel * 100;
    const progreso = Math.round((datos.xp / xpNecesario) * 100);
    
    // Crear embed simple
    const embed = new EmbedBuilder()
      .setTitle(`🐱 Nivel de ${interaction.user.username}`)
      .setColor(0xFF69B4)
      .addFields(
        { name: '📊 Nivel', value: `${datos.nivel}`, inline: true },
        { name: '⭐ XP Actual', value: `${datos.xp}`, inline: true },
        { name: '🎯 XP Necesario', value: `${xpNecesario}`, inline: true },
        { name: '📈 Progreso', value: `${progreso}%`, inline: false }
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
