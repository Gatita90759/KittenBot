
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario del cual ver el avatar (opcional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Obtener el usuario (si no se especifica, usar quien ejecutó el comando)
    const usuario = interaction.options.getUser('usuario') || interaction.user;
    
    // Obtener diferentes tamaños del avatar
    const avatar512 = usuario.displayAvatarURL({ size: 512, extension: 'png' });
    const avatar1024 = usuario.displayAvatarURL({ size: 1024, extension: 'png' });
    
    // Crear embed
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${usuario.username}`)
      .setDescription(`[Descargar en 512px](${avatar512}) | [Descargar en 1024px](${avatar1024})`)
      .setImage(avatar1024)
      .setColor(0x9B59B6)
      .setTimestamp()
      .setFooter({ text: `ID: ${usuario.id}` });

    await interaction.reply({ embeds: [embed] });
  }
};
