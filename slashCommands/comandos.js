const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // Importa SlashCommandBuilder y EmbedBuilder

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos') // Nombre del comando
    .setDescription('Muestra este mensaje con los comandos disponibles'), // Descripción del comando

  async execute(interaction) {
    // Asegurarte de que los comandos están definidos
    const clientCommands = interaction.client.slashCommands;

    // Validación: si no hay comandos definidos
    if (!clientCommands || clientCommands.size === 0) {
      return interaction.reply({ content: 'No hay comandos registrados.', ephemeral: true });
    }

    // Crear un mensaje embed
    const embed = new EmbedBuilder()
      .setTitle('Comandos Disponibles') // Título del embed
      .setDescription('Aquí están los comandos que puedes usar:') // Descripción principal
      .setColor(0x00FF00) // Color en formato hexadecimal
      .setTimestamp(); // Añade la fecha y hora actual

    // Agregar los comandos al embed como campos
    clientCommands.forEach((cmd) => {
      embed.addFields({ name: `\`/${cmd.name}\``, value: cmd.description, inline: false });
    });

    // Responder a la interacción con el embed
    await interaction.reply({ embeds: [embed], flags: 64 }); // Usamos `flags: 64` en lugar de `ephemeral`
  },
};