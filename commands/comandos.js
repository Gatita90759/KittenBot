const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'comandos',
  description: 'Muestra este mensaje con los comandos disponibles.',
  execute(message, args, clientCommands) {
    // Crear un mensaje embed
    const embed = new EmbedBuilder()
      .setTitle('Comandos Disponibles') // Título del embed
      .setDescription('Aquí están los comandos que puedes usar:') // Descripción principal
      .setColor(0x00FF00) // Color del embed
      .setTimestamp(); // Fecha y hora

    // Agregar los comandos al embed
    clientCommands.forEach((cmd) => {
      embed.addFields({ name: `\`${cmd.name}\``, value: cmd.description, inline: false });
    });

    // Enviar el embed
    message.channel.send({ embeds: [embed] });
  },
};