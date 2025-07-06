
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crea una encuesta con botones')
    .addStringOption(option =>
      option.setName('pregunta')
        .setDescription('La pregunta de la encuesta')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcion1')
        .setDescription('Primera opción')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcion2')
        .setDescription('Segunda opción')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('opcion3')
        .setDescription('Tercera opción (opcional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const pregunta = interaction.options.getString('pregunta');
    const opcion1 = interaction.options.getString('opcion1');
    const opcion2 = interaction.options.getString('opcion2');
    const opcion3 = interaction.options.getString('opcion3');

    // Crear botones
    const botones = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('poll_1')
          .setLabel(`1️⃣ ${opcion1}`)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('poll_2')
          .setLabel(`2️⃣ ${opcion2}`)
          .setStyle(ButtonStyle.Secondary)
      );

    // Agregar tercera opción si existe
    if (opcion3) {
      botones.addComponents(
        new ButtonBuilder()
          .setCustomId('poll_3')
          .setLabel(`3️⃣ ${opcion3}`)
          .setStyle(ButtonStyle.Success)
      );
    }

    const embed = new EmbedBuilder()
      .setTitle('📊 Encuesta')
      .setDescription(`**${pregunta}**\n\n🔸 ${opcion1}\n🔸 ${opcion2}${opcion3 ? `\n🔸 ${opcion3}` : ''}`)
      .setColor(0xF39C12)
      .setTimestamp()
      .setFooter({ text: 'Haz clic en los botones para votar' });

    await interaction.reply({ embeds: [embed], components: [botones] });

    // Collector para manejar los botones
    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000 // 1 minuto
    });

    const votos = { poll_1: 0, poll_2: 0, poll_3: 0 };
    const votantes = new Set();

    collector.on('collect', async (buttonInteraction) => {
      if (votantes.has(buttonInteraction.user.id)) {
        await buttonInteraction.reply({ content: '¡Ya votaste en esta encuesta!', ephemeral: true });
        return;
      }

      votantes.add(buttonInteraction.user.id);
      votos[buttonInteraction.customId]++;

      const embedActualizado = new EmbedBuilder()
        .setTitle('📊 Encuesta')
        .setDescription(`**${pregunta}**\n\n🔸 ${opcion1} - **${votos.poll_1} votos**\n🔸 ${opcion2} - **${votos.poll_2} votos**${opcion3 ? `\n🔸 ${opcion3} - **${votos.poll_3} votos**` : ''}`)
        .setColor(0xF39C12)
        .setTimestamp()
        .setFooter({ text: `Total de votos: ${votantes.size}` });

      await buttonInteraction.update({ embeds: [embedActualizado] });
    });

    collector.on('end', async () => {
      // Deshabilitar botones cuando termine
      const botonesDeshabilitados = ActionRowBuilder.from(botones);
      botonesDeshabilitados.components.forEach(button => button.setDisabled(true));

      await interaction.editReply({ components: [botonesDeshabilitados] });
    });
  }
};
