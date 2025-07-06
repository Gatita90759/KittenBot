
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('saludo')
    .setDescription('Saluda a alguien de manera personalizada')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a quien saludar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de saludo')
        .setRequired(false)
        .addChoices(
          { name: 'Formal', value: 'formal' },
          { name: 'Casual', value: 'casual' },
          { name: 'Divertido', value: 'divertido' }
        )
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const tipo = interaction.options.getString('tipo') || 'casual';
    
    // Diferentes tipos de saludo
    let mensaje;
    let emoji;
    let color;
    
    switch(tipo) {
      case 'formal':
        mensaje = `Buenos días, ${usuario}. Es un placer saludarle.`;
        emoji = '🎩';
        color = 0x2C3E50;
        break;
      case 'casual':
        mensaje = `¡Hola ${usuario}! ¿Cómo estás?`;
        emoji = '👋';
        color = 0x3498DB;
        break;
      case 'divertido':
        mensaje = `¡¡¡HOLAAA ${usuario}!!! 🎉🎊`;
        emoji = '🎉';
        color = 0xE74C3C;
        break;
      default:
        mensaje = `¡Hola ${usuario}!`;
        emoji = '👋';
        color = 0x95A5A6;
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`${emoji} Saludo ${tipo}`)
      .setDescription(mensaje)
      .setColor(color)
      .setTimestamp()
      .setFooter({ text: `Saludo enviado por ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
