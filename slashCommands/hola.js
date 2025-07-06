
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hola')
    .setDescription('idk, de prueba'),

  async execute(interaction) {
    await interaction.reply("howi :p");
  }
};
