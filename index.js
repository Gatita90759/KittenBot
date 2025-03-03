
const { Client, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');
const createBackup = require('./backupSystem.js').createBackup;

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

// Función para obtener archivos de manera recursiva en subcarpetas
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

// Inicializa la colección de comandos
client.commands = new Collection();
client.slashCommands = new Collection();

// Cargar comandos de la carpeta '/commands' y subcarpetas
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

// Cargar comandos slash de la carpeta '/slashCommands' y subcarpetas
const slashCommandFiles = getFilesRecursively('./slashCommands');
for (const file of slashCommandFiles) {
  const command = require(file);
  if (command.data) {
    client.slashCommands.set(command.data.name, command);
  }
}

client.on('ready', () => {
  console.log(`¡El bot está listo!`);

  // Iniciar sistema de respaldo
  setTimeout(() => createBackup(), 10000);
  setInterval(() => createBackup(), 86400000);
});

// Manejar interacciones de comandos slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ 
      content: 'Hubo un error al ejecutar este comando.',
      ephemeral: true 
    });
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    // Si es el comando 'comandos', pasa toda la colección de comandos
    if (command.name === 'comandos') {
      command.execute(message, args, Array.from(client.commands.values()));
    } else {
      command.execute(message, args);
    }
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error al ejecutar el comando.');
  }

  // Procesar XP
  const xpSystem = require('./slashCommands/xp.js');
  xpSystem(message);
});

client.login(config.TOKEN);