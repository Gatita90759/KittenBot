const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos') 
    .setDescription('Muestra este mensaje con los comandos disponibles'),

  async execute(interaction) {
    // Define clientCommands inside the execute function
    const clientCommands = interaction.client.slashCommands;

    if (!clientCommands || clientCommands.size === 0) {
      return interaction.reply({ content: 'No hay comandos registrados.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('Comandos Disponibles')
      .setDescription('Aquí están los comandos que puedes usar:')
      .setColor(0x00FF00)
      .setFooter({ text: '(solo salen los comandos slash o "/")' });

    clientCommands.forEach((cmd) => {
      embed.addFields({ name: `\`/${cmd.data.name}\``, value: cmd.data.description, inline: false });
    });

    await interaction.reply({ embeds: [embed] }); 
  }
};