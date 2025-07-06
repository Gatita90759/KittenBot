
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servidor')
    .setDescription('Muestra información del servidor'),

  async execute(interaction) {
    const guild = interaction.guild;
    
    // Obtener información del servidor
    const owner = await guild.fetchOwner();
    const canalesTexto = guild.channels.cache.filter(channel => channel.type === 0).size;
    const canalesVoz = guild.channels.cache.filter(channel => channel.type === 2).size;
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    
    // Calcular días desde creación
    const fechaCreacion = guild.createdAt;
    const diasDesdeCreacion = Math.floor((Date.now() - fechaCreacion) / (1000 * 60 * 60 * 24));
    
    const embed = new EmbedBuilder()
      .setTitle(`📊 Información de ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: '👑 Propietario', value: `${owner.user.tag}`, inline: true },
        { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Creado hace', value: `${diasDesdeCreacion} días`, inline: true },
        { name: '💬 Canales de texto', value: `${canalesTexto}`, inline: true },
        { name: '🔊 Canales de voz', value: `${canalesVoz}`, inline: true },
        { name: '🎭 Roles', value: `${roles}`, inline: true },
        { name: '😀 Emojis', value: `${emojis}`, inline: true },
        { name: '🆔 ID del servidor', value: `${guild.id}`, inline: true },
        { name: '🛡️ Nivel de verificación', value: `${guild.verificationLevel}`, inline: true }
      )
      .setColor(0x7289DA)
      .setTimestamp()
      .setFooter({ text: `Información solicitada por ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
