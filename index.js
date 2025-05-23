
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
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

// Handle messages for regular commands and XP
client.on('messageCreate', async message => {
  // Skip if message is from a bot
  if (message.author.bot) return;

  // Handle XP system
  if (!message.content.startsWith(config.prefix)) {
    try {
      const guildId = message.guild.id;
      const userId = message.author.id;
      const key = `level_${guildId}_${userId}`;
      
      // Get existing data
      const existingData = await db.get(key) || { xp: 0, level: 1 };
      
      // Calculate new XP
      const xpGain = Math.floor(Math.random() * 10) + 15;
      const newXP = existingData.xp + xpGain;
      
      // Check for level up
      const xpNeeded = existingData.level * 100;
      let newLevel = existingData.level;
      let finalXP = newXP;
      
      if (newXP >= xpNeeded) {
        newLevel += 1;
        finalXP = 0;
        message.channel.send(`¡Felicidades ${message.author}! Has subido al nivel ${newLevel} \<:ohsi:1343031913333657662>`);
      }
      
      // Save new data
      const newData = {
        xp: finalXP,
        level: newLevel
      };
      
      await db.set(key, newData);
      console.log(`XP actualizado para ${message.author.username}: Nivel ${newLevel}, XP ${finalXP}`);
    } catch (error) {
      console.error('Error al actualizar XP:', error);
    }
  }

  // Handle commands
  if (!message.content.startsWith(config.prefix)) return;

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

    const guildIds = config.GUILD_ID.split(',').map(id => id.trim());
    
    for (const guildId of guildIds) {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        console.warn(`⚠️ No se encontró el servidor con ID ${guildId}`);
        continue;
      }
      
      console.log(`Registrando comandos slash en el servidor: ${guild.name}`);
      const commands = Array.from(client.slashCommands.values()).map(cmd => cmd.data);
      await guild.commands.set(commands);
      console.log(`✅ Comandos slash registrados correctamente en ${guild.name}`);
    }

    console.log("Servidores disponibles:");
    client.guilds.cache.forEach(g => {
      console.log(`- ${g.name} (ID: ${g.id})`);
    });
  } catch (error) {
    console.error('Error al registrar comandos slash:', error);
  }
});

// Handle slash command interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) {
    await interaction.reply({ 
      content: 'Este comando no existe o no está disponible.',
      ephemeral: true 
    });
    return;
  }

  try {
    // Defer the reply to prevent timeout
    await interaction.deferReply();
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error al ejecutar el comando slash ${interaction.commandName}:`, error);
    
    const errorMessage = {
      content: 'Hubo un error al ejecutar el comando. Por favor, inténtalo de nuevo.',
      ephemeral: true
    };
    
    try {
      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else if (interaction.replied) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (followUpError) {
      console.error('Error al enviar mensaje de error:', followUpError);
    }
  }
});

// Log in
client.login(process.env.TOKEN)
  .then(() => console.log('Cliente conectado correctamente'))
  .catch((error) => console.error('Error al iniciar el cliente:', error));
