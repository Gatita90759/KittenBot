
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('matematicas')
    .setDescription('Calcula expresiones matemáticas')
    .addStringOption(option =>
      option.setName('expresion')
        .setDescription('La expresión matemática a calcular (ej: 2+2, 5*8, sqrt(16))')
        .setRequired(true)
    ),

  async execute(interaction) {
    const expresion = interaction.options.getString('expresion');

    // Función para validar expresión matemática segura
    function esExpresionSegura(expr) {
      // Solo permitir números, operadores matemáticos básicos y funciones seguras
      const patronSeguro = /^[0-9+\-*/().,\s\^%sqrtsincostan]*$/i;
      
      // Lista de palabras prohibidas (para evitar eval malicioso)
      const palabrasProhibidas = [
        'eval', 'function', 'require', 'import', 'export', 'var', 'let', 'const',
        'if', 'else', 'for', 'while', 'return', 'console', 'process', 'global'
      ];

      return patronSeguro.test(expr) && 
             !palabrasProhibidas.some(palabra => expr.toLowerCase().includes(palabra));
    }

    if (!esExpresionSegura(expresion)) {
      await interaction.reply({ 
        content: '❌ Expresión no válida. Solo se permiten números, +, -, *, /, ^, %, sqrt, sin, cos, tan', 
        ephemeral: true 
      });
      return;
    }

    try {
      // Reemplazar funciones matemáticas comunes
      let expresionProcesada = expresion
        .replace(/\^/g, '**')  // Potencia
        .replace(/sqrt\(/g, 'Math.sqrt(')  // Raíz cuadrada
        .replace(/sin\(/g, 'Math.sin(')    // Seno
        .replace(/cos\(/g, 'Math.cos(')    // Coseno
        .replace(/tan\(/g, 'Math.tan(')    // Tangente
        .replace(/pi/gi, 'Math.PI')        // Pi
        .replace(/e(?!\d)/gi, 'Math.E');   // Euler (solo si no es parte de un número)

      // Validación adicional antes de evaluar
      if (expresionProcesada.length > 100) {
        throw new Error('Expresión demasiado larga');
      }

      // Evaluar la expresión
      const resultado = eval(expresionProcesada);

      // Verificar si el resultado es válido
      if (!isFinite(resultado)) {
        throw new Error('Resultado no válido (infinito o NaN)');
      }

      const embed = new EmbedBuilder()
        .setTitle('🧮 Calculadora')
        .addFields(
          { name: '📝 Expresión:', value: `\`${expresion}\``, inline: false },
          { name: '✅ Resultado:', value: `\`${resultado}\``, inline: false }
        )
        .setColor(0x3498DB)
        .setTimestamp()
        .setFooter({ text: 'Funciones disponibles: +, -, *, /, ^, %, sqrt, sin, cos, tan, pi, e' });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Error en cálculo:', error);

      const embedError = new EmbedBuilder()
        .setTitle('❌ Error de Cálculo')
        .setDescription('No se pudo calcular la expresión. Verifica la sintaxis.')
        .addFields({ 
          name: '💡 Ejemplos válidos:', 
          value: '`2+2`, `5*8`, `sqrt(16)`, `sin(0)`, `2^3`' 
        })
        .setColor(0xE74C3C);

      await interaction.reply({ embeds: [embedError] });
    }
  }
};
