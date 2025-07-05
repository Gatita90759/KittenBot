
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { obtenerTop } = require('../utils/simpleXP');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Ver el ranking de niveles del servidor'),
    
  async execute(interaction) {
    const guildId = interaction.guild.id;
    
    // Obtener top 10
    const topUsuarios = await obtenerTop(guildId, 10);
    
    if (topUsuarios.length === 0) {
      await interaction.reply('No hay datos de niveles en este servidor.');
      return;
    }
    
    // Crear texto del ranking
    let ranking = '';
    for (let i = 0; i < topUsuarios.length; i++) {
      const usuario = topUsuarios[i];
      const member = await interaction.guild.members.fetch(usuario.userId).catch(() => null);
      const nombre = member ? member.displayName : 'Usuario desconocido';
      
      const posicion = i + 1;
      const emoji = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : '🔸';
      
      ranking += `${emoji} **${posicion}.** ${nombre} - Nivel ${usuario.nivel} (${usuario.xp} XP)\n`;
    }
    
    // Crear embed
    const embed = new EmbedBuilder()
      .setTitle('🏆 Ranking de Niveles')
      .setDescription(ranking)
      .setColor(0xFFD700)
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
