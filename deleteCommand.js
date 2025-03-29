require('dotenv').config(); // Si usas dotenv para cargar variables de entorno

const { REST, Routes } = require('discord.js');
const config = require('./config'); // Asegúrate de que config.TOKEN y config.CLIENT_ID estén bien cargados

// Convertir GUILD_ID en un array
const GUILD_IDS = process.env.GUILD_ID.split(',').map(id => id.trim());

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
  try {
    console.log(`Eliminando comandos en ${GUILD_IDS.length} servidores...`);

    for (const guildId of GUILD_IDS) {
      await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, guildId), { body: [] });
      console.log(`Comandos eliminados en el servidor ${guildId}`);
    }

    console.log('Comandos eliminados correctamente en todos los servidores.');
  } catch (error) {
    console.error('Error al eliminar comandos:', error);
  }
})();