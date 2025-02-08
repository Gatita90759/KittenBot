const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Asegúrate de tener tu archivo .env con el TOKEN y CLIENT_ID

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection(); // Para almacenar comandos normales
client.slashCommands = []; // Para almacenar comandos slash

// Cargar todos los comandos normales de la carpeta "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const commands = [];

// Cargar comandos slash
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
  const command = require(`./slashCommands/${file}`);
  commands.push(command.data.toJSON());
}

// Registrar comandos
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registrando comandos slash...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('¡Comandos slash registrados con éxito!');
  } catch (error) {
    console.error('Error al registrar los comandos slash:', error);
  }
})();

// Evento: Bot listo
client.once('ready', () => {
  console.log('¡El bot está listo!');
});

// Evento: Comandos normales (!comando)
client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) {
    return message.reply('Ese comando no existe, pon !comandos para ver los comandos :v');
  }

  try {
    command.execute(message, args, client.commands);
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error xd');
  }
});

// Evento: Comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const slashCommand = client.commands.get(interaction.commandName);
  if (!slashCommand) return;

  try {
    await slashCommand.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
  }
});

// Iniciar sesión con el token del bot
client.login(process.env.TOKEN);