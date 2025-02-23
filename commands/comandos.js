const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'comandos',
  description: 'Muestra este mensaje con los comandos disponibles.',
  execute(message, args, clientCommands) {
    // Depuración: Verificar si clientCommands es undefined o vacío
    console.log('clientCommands:', clientCommands);

    if (!clientCommands || clientCommands.length === 0) {
      return message.channel.send('No hay comandos disponibles.');
    }

    // Crear un mensaje embed
    const embed = new EmbedBuilder()
      .setTitle('Comandos Disponibles') // Título del embed
      .setDescription('Aquí están los comandos que puedes usar:') // Descripción principal
      .setColor(0x00FF00) // Color del embed
    .setTimestamp() // Fecha y hora
    .setFooter({ text: 'holi' }); // Footer personalizado


    // Agregar los comandos al embed
    clientCommands.forEach((cmd) => {
      embed.addFields({ name: `\`${cmd.name}\``, value: cmd.description, inline: false });
    });

    // Enviar el embed
    message.channel.send({ embeds: [embed] });
  },
};