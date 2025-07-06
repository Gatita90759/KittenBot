
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recordatorio')
    .setDescription('Configura un recordatorio')
    .addStringOption(option =>
      option.setName('tiempo')
        .setDescription('Tiempo del recordatorio (ej: 5m, 1h, 30s)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('mensaje')
        .setDescription('Mensaje del recordatorio')
        .setRequired(true)
    ),

  async execute(interaction) {
    const tiempoInput = interaction.options.getString('tiempo');
    const mensaje = interaction.options.getString('mensaje');

    // Función para convertir tiempo a milisegundos
    function convertirTiempo(tiempo) {
      const regex = /^(\d+)([smhd])$/;
      const match = tiempo.match(regex);
      
      if (!match) return null;
      
      const cantidad = parseInt(match[1]);
      const unidad = match[2];
      
      const multipliers = {
        's': 1000,        // segundos
        'm': 60 * 1000,   // minutos
        'h': 60 * 60 * 1000, // horas
        'd': 24 * 60 * 60 * 1000 // días
      };
      
      return cantidad * multipliers[unidad];
    }

    const milisegundos = convertirTiempo(tiempoInput);
    
    if (!milisegundos) {
      await interaction.reply({ 
        content: '❌ Formato de tiempo inválido. Usa: `5s`, `10m`, `2h`, `1d`', 
        ephemeral: true 
      });
      return;
    }

    if (milisegundos > 24 * 60 * 60 * 1000) { // Máximo 24 horas
      await interaction.reply({ 
        content: '❌ El recordatorio no puede ser mayor a 24 horas.', 
        ephemeral: true 
      });
      return;
    }

    // Responder inmediatamente
    const embedConfirmacion = new EmbedBuilder()
      .setTitle('⏰ Recordatorio Configurado')
      .setDescription(`Te recordaré: **${mensaje}**`)
      .addFields({ name: 'Tiempo:', value: tiempoInput, inline: true })
      .setColor(0x3498DB)
      .setTimestamp();

    await interaction.reply({ embeds: [embedConfirmacion] });

    // Configurar el recordatorio
    setTimeout(async () => {
      const embedRecordatorio = new EmbedBuilder()
        .setTitle('🔔 ¡Recordatorio!')
        .setDescription(mensaje)
        .setColor(0xE74C3C)
        .setTimestamp()
        .setFooter({ text: 'Tu recordatorio programado' });

      try {
        await interaction.followUp({ 
          content: `<@${interaction.user.id}>`, 
          embeds: [embedRecordatorio] 
        });
      } catch (error) {
        console.error('Error enviando recordatorio:', error);
      }
    }, milisegundos);
  }
};
