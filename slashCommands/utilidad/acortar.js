
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('acortar')
    .setDescription('Acorta una URL larga')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('La URL que quieres acortar')
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString('url');

    // Función para validar URL
    function esURLValida(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    if (!esURLValida(url)) {
      await interaction.reply({ 
        content: '❌ La URL proporcionada no es válida. Asegúrate de incluir `http://` o `https://`', 
        ephemeral: true 
      });
      return;
    }

    await interaction.deferReply();

    try {
      // Usar la API gratuita de TinyURL
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const urlAcortada = await response.text();

      if (urlAcortada.includes('Error')) {
        throw new Error('Error del servicio de acortamiento');
      }

      const embed = new EmbedBuilder()
        .setTitle('🔗 URL Acortada')
        .addFields(
          { name: '📎 URL Original:', value: `[${url.length > 50 ? url.substring(0, 47) + '...' : url}](${url})`, inline: false },
          { name: '✂️ URL Acortada:', value: `[${urlAcortada}](${urlAcortada})`, inline: false },
          { name: '📊 Reducción:', value: `${url.length} → ${urlAcortada.length} caracteres`, inline: true }
        )
        .setColor(0x27AE60)
        .setTimestamp()
        .setFooter({ text: 'Powered by TinyURL' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error acortando URL:', error);
      
      const embedError = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('No se pudo acortar la URL. Inténtalo de nuevo más tarde.')
        .setColor(0xE74C3C);

      await interaction.editReply({ embeds: [embedError] });
    }
  }
};
