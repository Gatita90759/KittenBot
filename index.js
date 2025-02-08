const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Para cargar las variables de entorno desde un archivo .env

// Crear el cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection(); // Inicializar almacenamiento de comandos

// Cargar los comandos slash desde la carpeta "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = []; // Array para los datos de los comandos que se registrarán

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) {
    client.commands.set(command.data.name, command); // Guardar comandos en la colección
    commands.push(command.data.toJSON()); // Agregar el comando al array para registrarlo
  }
}

// Registrar los comandos slash en Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log('Registrando comandos slash...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // Reemplaza con tu CLIENT_ID
      { body: commands },
    );
    console.log('¡Comandos slash registrados con éxito!');
  } catch (error) {
    console.error('Error registrando comandos slash:', error);
  }
})();

// Evento cuando el bot está listo
client.once('ready', () => {
  console.log('¡El bot está listo!');
});

// Manejar interacciones de comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction); // Ejecutar el comando
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
  }
});

// Iniciar sesión con el token del bot
client.login(process.env.TOKEN);const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // Importa SlashCommandBuilder y EmbedBuilder

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos') // Nombre del comando
    .setDescription('Muestra este mensaje con los comandos disponibles'), // Descripción del comando

  async execute(interaction) {
    // Asegurarte de que los comandos están definidos
    const clientCommands = interaction.client.slashCommands;

    // Validación: si no hay comandos definidos
    if (!clientCommands || clientCommands.size === 0) {
      return interaction.reply({ content: 'No hay comandos registrados.', ephemeral: true });
    }

    // Crear un mensaje embed
    const embed = new EmbedBuilder()
      .setTitle('Comandos Disponibles') // Título del embed
      .setDescription('Aquí están los comandos que puedes usar:') // Descripción principal
      .setColor(0x00FF00) // Color en formato hexadecimal
      .setTimestamp(); // Añade la fecha y hora actual

    // Agregar los comandos al embed como campos
    clientCommands.forEach((cmd) => {
      embed.addFields({ name: `\`/${cmd.name}\``, value: cmd.description, inline: false });
    });

    // Responder a la interacción con el embed
    await interaction.reply({ embeds: [embed], flags: 64 }); // Usamos `flags: 64` en lugar de `ephemeral`
  },
};