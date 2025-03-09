const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, IntentsBitField, SlashCommandBuilder } = require('discord.js');
const config = require('./config.js'); // Import the config file
const { Collection } = require('discord.js');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

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
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Comando ${command.data.name} cargado correctamente`);
    } else {
      console.log(`❌ El comando en ${filePath} no tiene una propiedad data o execute requerida`);
    }
  }
} catch (error) {
  console.error('Error al cargar comandos:', error);
}

// Registrar comandos Slash
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(config.GUILD_ID);
  if (!guild) {
    console.error("No se encontró el servidor especificado en config.js");
    return;
  }

  client.commands.forEach((command) => {
    guild.commands.create(command.data);
  });
});

// Procesar interacciones de comandos Slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.log(`Comando no encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    console.log('Ejecutando comando:', interaction.commandName);
    await command.execute(interaction, client.commands);
  } catch (error) {
    console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
  }
});

// Iniciar el cliente
client.login(process.env.TOKEN)
  .then(() => console.log('Cliente conectado correctamente'))
  .catch((error) => console.error('Error al iniciar el cliente:', error));