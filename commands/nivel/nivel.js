
const { EmbedBuilder } = require('discord.js');
const Level = require('../../models/level.js');
const { calculateNextLevelXP } = require('../../utils/levelCard.js');

module.exports = {
  name: 'nivel',
  description: 'Muestra información detallada de nivel',
  async execute(message, args) {
    try {
      const targetUser = message.mentions.users.first() || message.author;
      const levelData = await Level.findOne({ 
        userID: targetUser.id,
        guildID: message.guild.id 
      }) || { xp: 0, level: 0, totalMessages: 0, voiceTime: 0 };

      const nextLevelXP = calculateNextLevelXP(levelData.level);
      const progress = ((levelData.xp / nextLevelXP) * 100).toFixed(1);
      
      const embed = new EmbedBuilder()
        .setColor('#FF69B4')
        .setTitle(`📊 Estadísticas de Nivel - ${targetUser.username}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '📈 Nivel Actual', value: `${levelData.level}`, inline: true },
          { name: '⭐ XP Total', value: `${levelData.xp}/${nextLevelXP}`, inline: true },
          { name: '📝 Progreso', value: `${progress}%`, inline: true },
          { name: '💬 Mensajes Totales', value: `${levelData.totalMessages || 0}`, inline: true },
          { name: '🎤 Tiempo en Voz', value: `${Math.floor((levelData.voiceTime || 0)/60)}h ${(levelData.voiceTime || 0)%60}m`, inline: true },
          { name: '🔥 Racha Diaria', value: `${levelData.dailyStreak || 0} días`, inline: true }
        )
        .setFooter({ text: '¡Sigue participando para subir de nivel!' });

      if(levelData.achievements && levelData.achievements.length > 0) {
        embed.addFields({ 
          name: '🏆 Logros Desbloqueados', 
          value: levelData.achievements.join(', ') 
        });
      }

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error en comando nivel:', error);
      message.reply('Hubo un error al mostrar el nivel. Por favor, inténtalo de nuevo.');
    }
  }
};
