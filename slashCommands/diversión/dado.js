
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
    // Obtener el número de caras (por defecto 6)
    const caras = interaction.options.getInteger('caras') || 6;
    
    // Generar número aleatorio
    const resultado = Math.floor(Math.random() * caras) + 1;
    
    // Crear embed
    const embed = new EmbedBuilder()
      .setTitle('🎲 Resultado del Dado')
      .setDescription(`Has tirado un dado de **${caras}** caras`)
      .addFields({ 
        name: 'Resultado', 
        value: `**${resultado}**`, 
        inline: false 
      })
      .setColor(0xFF6B35)
      .setTimestamp()
      .setFooter({ text: `Tirado por ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
