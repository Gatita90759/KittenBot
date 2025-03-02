const { Client, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const xpSystem = require('./slashCommands/niveles/xp.js'); // Importamos el sistema de XP

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

// Inicializa la colección de comandos
client.commands = new Collection();

// Cargar comandos de la carpeta '/commands'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`¡El bot está listo!`);

  // Inicializar la colección de slashCommands
  client.slashCommands = new Collection();

  // Cargar comandos slash desde la carpeta '/slashCommands'
  const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const command = require(`./slashCommands/${file}`);
    client.slashCommands.set(command.data.name, command);
  }
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

// Manejar mensajes para el sistema de XP
client.on('messageCreate', async (message) => {
  if (message.content.startsWith(config.prefix)) {
    // Ejecutar comandos con prefijo
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (command) {
      try {
        await command.execute(message, args, client.commands);
      } catch (error) {
        console.error(error);
        message.reply('Hubo un error al ejecutar el comando.');
      }
    }
  }

  // Llamamos al sistema de XP
  await xpSystem(message);
});

client.login(config.TOKEN);