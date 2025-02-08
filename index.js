const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Para cargar las variables de entorno desde un archivo .env

// Crear el cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection(); // Inicializar almacenamiento de comandos

// Cargar los comandos slash desde la carpeta "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Cargar comandos
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) {
    client.commands.set(command.data.name, command);
  }
}

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
client.login(process.env.TOKEN);