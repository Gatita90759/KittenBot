
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pregúntale algo a la bola mágica 8')
    .addStringOption(option =>
      option.setName('pregunta')
        .setDescription('Tu pregunta para la bola mágica')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pregunta = interaction.options.getString('pregunta');
    
    // Array de respuestas posibles
    const respuestas = [
      'Es cierto',
      'Es decididamente así',
      'Sin lugar a dudas',
      'Sí, definitivamente',
      'Puedes contar con ello',
      'Como yo lo veo, sí',
      'Muy probable',
      'Las perspectivas son buenas',
      'Sí',
      'Las señales apuntan a que sí',
      'La respuesta es confusa, intenta de nuevo',
      'Pregunta de nuevo más tarde',
      'Mejor no te lo digo ahora',
      'No puedo predecirlo ahora',
      'Concéntrate y pregunta de nuevo',
      'No cuentes con ello',
      'Mi respuesta es no',
      'Mis fuentes dicen que no',
      'Las perspectivas no son tan buenas',
      'Muy dudoso'
    ];

    // Seleccionar respuesta aleatoria
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
    
    const embed = new EmbedBuilder()
      .setTitle('🎱 Bola Mágica 8')
      .addFields(
        { name: '❓ Pregunta:', value: pregunta, inline: false },
        { name: '🔮 Respuesta:', value: respuestaAleatoria, inline: false }
      )
      .setColor(0x8B4513)
      .setTimestamp()
      .setFooter({ text: 'La bola mágica ha hablado' });

    await interaction.reply({ embeds: [embed] });
  }
};
