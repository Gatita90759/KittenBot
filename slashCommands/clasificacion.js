
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clasificacion")
    .setDescription("Muestra los usuarios con más nivel en el servidor"),
    
  async execute(interaction) {
    await interaction.deferReply();
    
    const guildId = interaction.guild.id;
    const allKeys = await db.all();
    
    // Filtrar solo las entradas de nivel para este servidor
    const levelData = allKeys
      .filter(entry => entry.id && entry.id.startsWith(`level_${guildId}_`))
      .map(entry => {
        const userId = entry.id.split('_')[2];
        return {
          userId,
          level: entry.value.level || 1,
          xp: entry.value.xp || 0
        };
      })
      .sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        return b.xp - a.xp;
      })
      .slice(0, 5);

    const embed = new EmbedBuilder()
      .setTitle("\<:xi:1332882536648540221>Clasificación\<:xi:1332882536648540221>")
      .setColor(0xFFD700)
      .setTimestamp();
    
    if (levelData.length === 0) {
      embed.setDescription("Aún no hay datos de nivel en este servidor\<:reimusad:1332149409487781888>");
    } else {
      let description = "";
      
      for (let i = 0; i < levelData.length; i++) {
        const data = levelData[i];
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
        
        try {
          const user = await interaction.client.users.fetch(data.userId);
          description += `${medal} **${user.username}** - Nivel ${data.level} (${data.xp} XP)\n`;
        } catch (error) {
          description += `${medal} **Usuario Desconocido** - Nivel ${data.level} (${data.xp} XP)\n`;
        }
      }
      
      embed.setDescription(description);
    }
    
    await interaction.editReply({ embeds: [embed] });
  }
};
