const fs = require('fs');
const { Client, IntentsBitField, Collection } = require('discord.js');
const config = require('./config.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const client = new Client({ 
  intents: [
    IntentsBitField.Flags.Guilds, 
    IntentsBitField.Flags.GuildMessages, 
    IntentsBitField.Flags.MessageContent
  ] 
});

// Solo una colección para comandos slash (más moderno)
client.slashCommands = new Collection();

// Cargar comandos slash
const slashCommandsPath = './slashCommands';
if (fs.existsSync(slashCommandsPath)) {
  const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const command = require(`${slashCommandsPath}/${file}`);

    if (command.data && command.execute) {
      client.slashCommands.set(command.data.name, command);
      console.log(`✅ Comando ${command.data.name} cargado`);
    }
  }
}

// Sistema XP simple - solo en mensajes normales
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Solo dar XP, no manejar comandos aquí
  await darXP(message);
});

// Función simple para dar XP
async function darXP(message) {
  try {
    const userId = message.author.id;
    const guildId = message.guild.id;
    const key = `xp_${guildId}_${userId}`;

    // Obtener datos actuales
    const datos = await db.get(key) || { xp: 0, nivel: 1 };

    // Dar XP random entre 15-25
    const xpGanado = Math.floor(Math.random() * 10) + 15;
    datos.xp += xpGanado;

    // Verificar si sube de nivel
    const xpNecesario = datos.nivel * 100;
    if (datos.xp >= xpNecesario) {
      datos.nivel += 1;
      datos.xp = 0; // Resetear XP

      // Mensaje de nivel subido
      message.channel.send(`🎉 ¡${message.author} subió al nivel ${datos.nivel}!`);
    }

    // Guardar datos
    await db.set(key, datos);

  } catch (error) {
    console.error('Error en XP:', error);
  }
}

// Cuando el bot esté listo
client.on('ready', async () => {
  console.log(`✅ ${client.user.tag} está online!`);

  // Registrar comandos slash
  if (config.GUILD_ID) {
    const guildIds = config.GUILD_ID.split(',').map(id => id.trim());

    for (const guildId of guildIds) {
      const guild = client.guilds.cache.get(guildId);
      if (guild) {
        const commands = Array.from(client.slashCommands.values()).map(cmd => cmd.data);
        await guild.commands.set(commands);
        console.log(`✅ Comandos registrados en ${guild.name}`);
      }
    }
  }
});

// Manejar comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error:', error);
    const mensaje = 'Hubo un error al ejecutar el comando.';

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: mensaje, ephemeral: true });
    } else {
      await interaction.reply({ content: mensaje, ephemeral: true });
    }
  }
});

// Iniciar el bot
client.login(process.env.TOKEN);