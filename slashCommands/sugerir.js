const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sugerir')
    .setDescription('Envía una sugerencia para el servidor')
    .addStringOption(option =>
      option.setName('sugerencia')
        .setDescription('Tu sugerencia')
        .setRequired(true)),

  async execute(interaction) {
    const sugerencia = interaction.options.getString('sugerencia');
    
    const embed = new EmbedBuilder()
      .setTitle('📝 Nueva Sugerencia')
      .setDescription(sugerencia)
      .setColor(0x3498DB)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp()
      .setFooter({ text: '💡 Reacciona para votar' });

    const mensaje = await interaction.reply({ 
      embeds: [embed],
      fetchReply: true
    });

    // Agregar reacciones para votar
    await mensaje.react('👍');
    await mensaje.react('👎');
  },
};
