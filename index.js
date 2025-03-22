
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://<Miau>:MupfWNCLUYOyAtlz>@cluster0.hdgpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  retryWrites: true,
  w: "majority"
}).then(() => {
  console.log("✅ Conectado a la base de datos.");
}).catch(err => console.error("❌ Error conectando a la base de datos:", err));

const client = new Client({ 
  intents: [
    IntentsBitField.Flags.Guilds, 
    IntentsBitField.Flags.GuildMessages, 
    IntentsBitField.Flags.MessageContent
  ] 
});

// Collections for both types of commands
client.commands = new Collection(); // Regular commands
client.slashCommands = new Collection(); // Slash commands

// Load regular commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = `./commands/${file}`;
  console.log(`Cargando comando regular: ${filePath}`);
  const command = require(filePath);
  
  // Check if it has name and execute properties
  if (command.name && command.execute) {
    client.commands.set(command.name, command);
    console.log(`✅ Comando regular ${command.name} cargado correctamente`);
  } else {
    console.log(`❌ El comando en ${filePath} no tiene las propiedades requeridas`);
  }
}

// Load slash commands
const slashCommandsPath = './slashCommands';
if (fs.existsSync(slashCommandsPath)) {
  const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const filePath = `${slashCommandsPath}/${file}`;
    console.log(`Cargando comando slash: ${filePath}`);
    const command = require(filePath);
    
    if (command.data && command.execute) {
      client.slashCommands.set(command.data.name, command);
      console.log(`✅ Comando slash ${command.data.name} cargado correctamente`);
    } else {
      console.log(`❌ El comando slash en ${filePath} no tiene las propiedades requeridas`);
    }
  }
}

// Handle messages for regular commands
client.on('messageCreate', message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
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

// Register slash commands when ready
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    // First, check if GUILD_ID is available
    if (!config.GUILD_ID) {
      console.warn("⚠️ No GUILD_ID specified in config.js or .env. Using global commands instead.");
      return;
    }

    const guild = client.guilds.cache.get(config.GUILD_ID);
    if (!guild) {
      console.warn(`⚠️ No se encontró el servidor con ID ${config.GUILD_ID}. Verifique GUILD_ID en su .env`);
      console.log("Servidores disponibles:");
      client.guilds.cache.forEach(g => {
        console.log(`- ${g.name} (ID: ${g.id})`);
      });
      return;
    }

    console.log(`Registrando comandos slash en el servidor: ${guild.name}`);
    const commands = Array.from(client.slashCommands.values()).map(cmd => cmd.data);
    await guild.commands.set(commands);
    console.log('Comandos slash registrados correctamente');
  } catch (error) {
    console.error('Error al registrar comandos slash:', error);
  }
});

// Handle slash command interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error al ejecutar el comando slash ${interaction.commandName}:`, error);
    const replyContent = {
      content: 'Hubo un error al ejecutar el comando.',
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyContent);
    } else {
      await interaction.reply(replyContent);
    }
  }
});

// Log in
client.login(process.env.TOKEN)
  .then(() => console.log('Cliente conectado correctamente'))
  .catch((error) => console.error('Error al iniciar el cliente:', error));
