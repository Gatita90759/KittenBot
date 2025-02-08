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
client.login(process.env.TOKEN);