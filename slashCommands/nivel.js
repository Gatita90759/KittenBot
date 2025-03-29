
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateLevelCard } = require('../utils/levelCard.js');
const Level = require('../models/level.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nivel')
    .setDescription('Muestra tu nivel actual o el de otro usuario')
    .addUserOption(option => 
      option
        .setName('usuario')
        .setDescription('Usuario del que quieres ver el nivel')
        .setRequired(false)),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('usuario') || interaction.user;
      const levelData = await Level.findOne({ 
        userID: targetUser.id,
        guildID: interaction.guild.id 
      }) || { xp: 0, level: 0 };

      const cardBuffer = await generateLevelCard(targetUser, levelData);
      
      await interaction.editReply({
        files: [{
          attachment: cardBuffer,
          name: 'nivel.png'
        }]
      });
    } catch (error) {
      console.error('Error en comando nivel:', error);
      await interaction.editReply({
        content: 'Hubo un error al mostrar el nivel. Por favor, inténtalo de nuevo.',
        ephemeral: true
      });
    }
  }
};
