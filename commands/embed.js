const { EmbedBuilder } = require('discord.js'); // Importa EmbedBuilder
// e, esto no se va usar, es de prueba :v XD
module.exports = {
  name: 'embed', // Nombre del comando
  description: 'Envía un mensaje embed (prueba)', // Descripción del comando
  execute(message) {
    // Crear el embed
    const embed = new EmbedBuilder()
      .setTitle('Título del Embed') // Título del embed
      .setDescription('Este es un mensaje embed creado con Discord.js v14.') // Descripción
      .setColor(0x00FF00) // Color en formato hexadecimal
      .addFields(
        { name: 'Campo 1', value: 'Contenido del campo 1', inline: false },
        { name: 'Campo 2', value: 'Contenido del campo 2', inline: true }
      ) // Agrega múltiples campos
      .setFooter({ text: 'Texto del pie de página' }) // Pie de página
      .setTimestamp(); // Añade la hora actual

    // Enviar el embed
    message.channel.send({ embeds: [embed] });
  },
};