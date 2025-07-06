
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos') 
    .setDescription('Muestra este mensaje con los comandos disponibles'),

  async execute(interaction) {
    const clientCommands = interaction.client.slashCommands;

    if (!clientCommands || clientCommands.size === 0) {
      return interaction.reply({ content: 'No hay comandos registrados.', ephemeral: true });
    }

    // Organizar comandos por categorías
    const categorias = {
      'utilidad': { emoji: '🔧', comandos: [] },
      'diversión': { emoji: '🎮', comandos: [] },
      'información': { emoji: '📊', comandos: [] },
      'moderación': { emoji: '🛡️', comandos: [] }
    };

    // Clasificar comandos
    clientCommands.forEach((cmd) => {
      const categoria = cmd.categoria || 'información';
      if (categorias[categoria]) {
        categorias[categoria].comandos.push(cmd);
      }
    });

    const embed = new EmbedBuilder()
      .setTitle('📋 Comandos Disponibles')
      .setDescription('Aquí están todos los comandos organizados por categorías:')
      .setColor(0x00FF00)
      .setTimestamp()
      .setFooter({ text: 'Usa / antes del nombre del comando para ejecutarlo' });

    // Agregar cada categoría como un field
    Object.entries(categorias).forEach(([nombreCategoria, datos]) => {
      if (datos.comandos.length > 0) {
        const comandosTexto = datos.comandos
          .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`)
          .join('\n');
        
        embed.addFields({
          name: `${datos.emoji} ${nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1)}`,
          value: comandosTexto,
          inline: false
        });
      }
    });

    await interaction.reply({ embeds: [embed] });
  }
};
