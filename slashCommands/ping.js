
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Muestra la latencia del bot'),

  async execute(interaction) {
    // Obtener el tiempo actual
    const enviado = Date.now();
    
    // Responder al comando
    await interaction.reply('🏓 Calculando ping...');
    
    // Calcular la latencia
    const latencia = Date.now() - enviado;
    const apiLatencia = Math.round(interaction.client.ws.ping);

    // Crear embed con la información
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(0x00FF00)
      .addFields(
        { name: 'Latencia del Bot', value: `${latencia}ms`, inline: true },
        { name: 'Latencia de la API', value: `${apiLatencia}ms`, inline: true }
      )
      .setTimestamp();

    // Editar la respuesta con el embed
    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
