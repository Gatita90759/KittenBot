
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nivel")
    .setDescription("Muestra tu nivel actual o el de otro usuario")
    .addUserOption(option => 
      option.setName("usuario")
        .setDescription("El usuario del que quieres ver el nivel (opcional)")
        .setRequired(false)),
        
  async execute(interaction) {
    // Usuario objetivo (el mencionado o el que usa el comando)
    const targetUser = interaction.options.getUser("usuario") || interaction.user;
    const guildId = interaction.guild.id;
    const userId = targetUser.id;
    const key = `level_${guildId}_${userId}`;
    
    // Obtener datos del usuario
    const userData = await db.get(key) || { xp: 0, level: 1 };
    
    // Calcular XP necesario para el siguiente nivel
    const xpNeeded = userData.level * 100;
    
    // Crear embed
    const embed = new EmbedBuilder()
      .setTitle(`\<:xi:1332882536648540221> Nivel de ${targetUser.username}`)
      .setDescription(`Información de nivel y experiencia`)
      .setColor(0x3498DB)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Nivel", value: `${userData.level}`, inline: true },
        { name: "XP", value: `${userData.xp}/${xpNeeded}`, inline: true },
        { name: "Progreso", value: `${Math.floor((userData.xp / xpNeeded) * 100)}%`, inline: true }
      )
      .setFooter({ text: "Sigue enviando mensajes para ganar más XP" })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
