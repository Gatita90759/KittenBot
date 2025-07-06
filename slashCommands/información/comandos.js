
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

    // Embed principal con las categorías
    const embedPrincipal = new EmbedBuilder()
      .setTitle('📋 Comandos Disponibles')
      .setDescription('Selecciona una categoría para ver los comandos disponibles:')
      .setColor(0x00FF00)
      .setTimestamp()
      .setFooter({ text: 'Usa los botones para navegar entre categorías' });

    // Agregar información de cada categoría
    Object.entries(categorias).forEach(([nombreCategoria, datos]) => {
      if (datos.comandos.length > 0) {
        embedPrincipal.addFields({
          name: `${datos.emoji} ${nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1)}`,
          value: `${datos.comandos.length} comando(s) disponible(s)`,
          inline: true
        });
      }
    });

    // Crear botones para las categorías
    const botonesCategorias = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('cat_utilidad')
          .setLabel('🔧 Utilidad')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('cat_diversión')
          .setLabel('🎮 Diversión')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('cat_información')
          .setLabel('📊 Información')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('cat_moderación')
          .setLabel('🛡️ Moderación')
          .setStyle(ButtonStyle.Danger)
      );

    // Botón para volver al menú principal
    const botonVolver = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('volver_menu')
          .setLabel('⬅️ Volver al menú')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [embedPrincipal], components: [botonesCategorias] });

    // Collector para manejar los botones
    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 300000 // 5 minutos
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'volver_menu') {
        // Volver al menú principal
        await buttonInteraction.update({ embeds: [embedPrincipal], components: [botonesCategorias] });
      } else if (buttonInteraction.customId.startsWith('cat_')) {
        // Mostrar comandos de la categoría seleccionada
        const categoria = buttonInteraction.customId.replace('cat_', '');
        const datosCategoria = categorias[categoria];

        if (!datosCategoria || datosCategoria.comandos.length === 0) {
          await buttonInteraction.reply({ content: 'No hay comandos en esta categoría.', ephemeral: true });
          return;
        }

        const embedCategoria = new EmbedBuilder()
          .setTitle(`${datosCategoria.emoji} Comandos de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`)
          .setDescription(`Aquí están todos los comandos de la categoría **${categoria}**:`)
          .setColor(0x3498DB)
          .setTimestamp()
          .setFooter({ text: 'Usa / antes del nombre del comando para ejecutarlo' });

        // Agregar comandos de la categoría
        const comandosTexto = datosCategoria.comandos
          .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`)
          .join('\n');

        embedCategoria.addFields({
          name: 'Comandos disponibles:',
          value: comandosTexto,
          inline: false
        });

        await buttonInteraction.update({ embeds: [embedCategoria], components: [botonVolver] });
      }
    });

    collector.on('end', async () => {
      // Desactivar botones cuando expire el collector
      const botonesDesactivados = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('cat_utilidad')
            .setLabel('🔧 Utilidad')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('cat_diversión')
            .setLabel('🎮 Diversión')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('cat_información')
            .setLabel('📊 Información')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('cat_moderación')
            .setLabel('🛡️ Moderación')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

      try {
        await interaction.editReply({ components: [botonesDesactivados] });
      } catch (error) {
        // Ignora errores si el mensaje ya no existe
      }
    });
  }
};
