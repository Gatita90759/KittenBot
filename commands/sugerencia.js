
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'sugerencia',
  description: 'Envía una sugerencia para el servidor',
  execute: async (message, args) => {
    // Verificar si hay una sugerencia
    if (!args.length) {
      return message.reply('¡Debes escribir una sugerencia para que funcione!');
    }

    const sugerencia = args.join(' ');
    const mensaje = new EmbedBuilder()
      .setTitle('📝 Nueva Sugerencia')
      .setDescription(sugerencia)
      .setColor(0x3498DB)
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp()
      .setFooter({ text: '💡 Reacciona para votar' });

    const mensajeEnviado = await message.channel.send({ embeds: [mensaje] });

    // Agregar reacciones para votar
    await mensajeEnviado.react('👍');
    await mensajeEnviado.react('👎');
  },
};