
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Crear el cliente con los intents necesarios
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Inicializar colecciones
client.commands = new Collection(); // Comandos normales
client.slashCommands = new Collection(); // Comandos slash

// Cargar comandos normales
const normalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of normalCommandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Cargar comandos slash
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
  const command = require(`./slashCommands/${file}`);
  if (command.data) {
    client.slashCommands.set(command.data.name, command);
  }
}

// Evento cuando el bot está listo
client.once('ready', () => {
  console.log('¡El bot está listo!');
});

// Manejar comandos normales
client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args, client.commands);
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error al ejecutar el comando.');
  }
});

// Manejar comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
  }
});

// Iniciar sesión
client.login(process.env.TOKEN);
