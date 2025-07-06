
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clima')
    .setDescription('Obtiene el clima de una ciudad')
    .addStringOption(option =>
      option.setName('ciudad')
        .setDescription('Nombre de la ciudad')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ciudad = interaction.options.getString('ciudad');

    await interaction.deferReply();

    try {
      // Usar API gratuita de OpenWeatherMap (requiere clave API)
      // Para este ejemplo, simularemos datos climáticos
      
      // En un caso real, harías:
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=TU_API_KEY&units=metric&lang=es`);
      // const data = await response.json();

      // Simulación de datos para el ejemplo
      const climasSimulados = [
        { temp: 22, descripcion: 'Soleado', humedad: 45, viento: 12 },
        { temp: 18, descripcion: 'Nublado', humedad: 60, viento: 8 },
        { temp: 15, descripcion: 'Lluvia ligera', humedad: 85, viento: 15 },
        { temp: 28, descripcion: 'Muy soleado', humedad: 30, viento: 5 },
        { temp: 10, descripcion: 'Frío y ventoso', humedad: 70, viento: 20 }
      ];

      const climaAleatorio = climasSimulados[Math.floor(Math.random() * climasSimulados.length)];

      // Función para obtener emoji del clima
      function obtenerEmojiClima(descripcion) {
        if (descripcion.includes('sol')) return '☀️';
        if (descripcion.includes('nubl')) return '☁️';
        if (descripcion.includes('lluv')) return '🌧️';
        if (descripcion.includes('fría')) return '🥶';
        return '🌤️';
      }

      const embed = new EmbedBuilder()
        .setTitle(`${obtenerEmojiClima(climaAleatorio.descripcion)} Clima en ${ciudad}`)
        .addFields(
          { name: '🌡️ Temperatura:', value: `${climaAleatorio.temp}°C`, inline: true },
          { name: '📝 Descripción:', value: climaAleatorio.descripcion, inline: true },
          { name: '💧 Humedad:', value: `${climaAleatorio.humedad}%`, inline: true },
          { name: '💨 Viento:', value: `${climaAleatorio.viento} km/h`, inline: true }
        )
        .setColor(0x87CEEB)
        .setTimestamp()
        .setFooter({ 
          text: '⚠️ Datos simulados para demostración. Para usar datos reales, configura una API key de OpenWeatherMap' 
        });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error obteniendo clima:', error);

      const embedError = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('No se pudo obtener la información del clima. Inténtalo más tarde.')
        .setColor(0xE74C3C);

      await interaction.editReply({ embeds: [embedError] });
    }
  }
};
