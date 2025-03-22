const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('Muestra o gestiona XP del usuario'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const key = `level_${guildId}_${userId}`;

    // Get current user data
    let userData = await db.get(key) || { xp: 0, level: 1 };

    const embed = new EmbedBuilder()
      .setTitle('Nivel y XP')
      .setDescription(`**Nivel:** ${userData.level}\n**XP:** ${userData.xp}`)
      .setColor(0x00FF00)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};