
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'sugerencia',
  description: 'Envía una sugerencia para el servidor',
  execute: async (message, args) => {
    // Verificar que no sea un comando slash
    if (message.interaction) return;
    
    // Verificar si hay una sugerencia
    if (!args.length) {
      const reply = await message.reply('¡Debes escribir una sugerencia para que funcione!');
      return;
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
