const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('Tira un dado de X caras')
    .addIntegerOption(option =>
      option.setName('caras')
        .setDescription('Número de caras del dado (por defecto 6)')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    mensaje.reply("howi :p")}
}
;