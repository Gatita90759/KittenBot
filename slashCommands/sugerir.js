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
    try {
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

      // Si la interacción ya fue diferida, editamos la respuesta
      if (interaction.deferred) {
        const mensaje = await interaction.editReply({ 
          embeds: [embed],
          fetchReply: true
        });

        // Agregar reacciones para votar
        await mensaje.react('👍');
        await mensaje.react('👎');
      } else {
        // Si no fue diferida, respondemos normalmente
        const mensaje = await interaction.reply({ 
          embeds: [embed],
          fetchReply: true
        });

        // Agregar reacciones para votar
        await mensaje.react('👍');
        await mensaje.react('👎');
      }
    } catch (error) {
      console.error('Error en comando sugerir:', error);

      const errorMessage = {
        content: 'Hubo un error al procesar tu sugerencia. Inténtalo de nuevo.',
        ephemeral: true
      };

      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
};