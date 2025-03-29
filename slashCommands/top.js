
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Level = require('../models/level.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Muestra la clasificación de niveles del servidor'),

  async execute(interaction) {
    try {
      const levels = await Level.find({ guildID: interaction.guild.id })
        .sort({ level: -1, xp: -1 })
        .limit(10);

      if (!levels.length) {
        return await interaction.editReply('¡Aún no hay usuarios en la clasificación!');
      }

      const embed = new EmbedBuilder()
        .setTitle('🏆 Top 10 - Clasificación de Niveles')
        .setColor('#FF69B4')
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp();

      let description = '';
      for (let i = 0; i < levels.length; i++) {
        const user = await interaction.client.users.fetch(levels[i].userID);
        description += `${i + 1}. ${user.tag}\n📊 Nivel: ${levels[i].level} • XP: ${levels[i].xp}\n\n`;
      }

      embed.setDescription(description);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error en comando top:', error);
      await interaction.editReply({
        content: 'Hubo un error al mostrar la clasificación. Por favor, inténtalo de nuevo.',
        ephemeral: true
      });
    }
  }
};
