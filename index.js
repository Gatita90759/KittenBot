const { Client, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

// Inicializa la colección de client.commands
client.commands = new Collection();

// Cargar comandos de la carpeta '/commands'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`¡El bot está listo!`);

  // Inicializar la colección de slashCommands aquí
  client.slashCommands = new Collection();

  // Cargar comandos slash desde la carpeta '/slashCommands'
  const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const command = require(`./slashCommands/${file}`);
    client.slashCommands.set(command.data.name, command);
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  
  if (!command) return;

  // Evitar duplicación de comandos
  const key = `${message.author.id}-${message.content}-${Date.now()}`;
  if (client.recentCommands && client.recentCommands.has(key)) return;
  
  if (!client.recentCommands) client.recentCommands = new Set();
  client.recentCommands.add(key);
  setTimeout(() => client.recentCommands.delete(key), 2000);

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error al ejecutar el comando.');
  }
});

client.login(config.TOKEN);