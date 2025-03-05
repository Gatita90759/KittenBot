const fs = require('fs');
const path = require('path');
const { Collection, Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.js'); // Import the config file

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();
client.slashCommands = new Collection();

function getFilesRecursively(directory, extension = '.js') {
  let files = [];
  const items = fs.readdirSync(directory, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath, extension));
    } else if (item.isFile() && item.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Cargar comandos de la carpeta '/commands'
try {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = `./commands/${file}`;
    console.log(`Cargando comando: ${filePath}`);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
      client.commands.set(command.name, command);
      console.log(`✅ Comando ${command.name} cargado correctamente`);
    } else {
      console.log(`❌ El comando en ${filePath} no tiene una propiedad name o execute requerida`);
    }
  }
} catch (error) {
  console.error('Error al cargar comandos:', error);
}

// Procesar mensajes
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(config.prefix)) return; // Check if message starts with the prefix

  const args = message.content.slice(config.prefix.length).trim().split(/\s+/); // Remove prefix and split into arguments
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  console.log('Comando detectado:', commandName); // Registro de depuración

  if (!command) {
    console.log(`Comando no encontrado: ${commandName}`);
    return;
  }

  try {
    console.log('Ejecutando comando:', commandName);
    command.execute(message, args, client.commands);
  } catch (error) {
    console.error(`Error al ejecutar el comando ${commandName}:`, error);
    message.reply('Hubo un error al ejecutar el comando.');
  }
});

// Iniciar el cliente
client.login(process.env.TOKEN)
  .then(() => console.log('Cliente conectado correctamente'))
  .catch((error) => console.error('Error al iniciar el cliente:', error));