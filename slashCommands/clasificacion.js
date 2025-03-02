
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clasificacion")
    .setDescription("Muestra los usuarios con más nivel en el servidor"),
    
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const allKeys = await db.all();
    
    // Filtrar solo las entradas de nivel para este servidor
    const levelData = allKeys
      .filter(entry => entry.id.startsWith(`level_${guildId}_`))
      .map(entry => {
        const userId = entry.id.split('_')[2];
        return {
          userId,
          level: entry.value.level,
          xp: entry.value.xp
        };
      })
      // Ordenar por nivel (descendente) y luego por XP (descendente)
      .sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        return b.xp - a.xp;
      })
      // Tomar los 10 primeros
      .slice(0, 10);

    // Crear un embed para la clasificación
    const embed = new EmbedBuilder()
      .setTitle("🏆 Clasificación de Niveles")
      .setDescription("Los usuarios con más nivel en el servidor")
      .setColor(0xFFD700) // Color dorado
      .setTimestamp();
    
    if (levelData.length === 0) {
      embed.setDescription("Aún no hay datos de nivel en este servidor.");
    } else {
      // Construir la lista de usuarios
      let description = "";
      
      for (let i = 0; i < levelData.length; i++) {
        const data = levelData[i];
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
        const user = await interaction.client.users.fetch(data.userId).catch(() => null);
        
        if (user) {
          description += `${medal} **${user.username}** - Nivel ${data.level} (${data.xp} XP)\n`;
        }
      }
      
      embed.setDescription(description);
    }
    
    await interaction.reply({ embeds: [embed] });
  }
};
