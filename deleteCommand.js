const { REST, Routes } = require('discord.js');
module.exports = {
const TOKEN: process.env.TOKEN,
  const CLIENT_ID: process.env.CLIENT_ID,
    
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Eliminando comando específico...');
        const commands = await rest.get(Routes.applicationCommands(clientId));

        const commandToDelete = commands.find(cmd => cmd.name === 'active-dev-badge');

        if (commandToDelete) {
            await rest.delete(Routes.applicationCommand(clientId, commandToDelete.id));
            console.log(`Comando /active-dev-badge eliminado.`);
        } else {
            console.log('No se encontró el comando.');
        }
    } catch (error) {
        console.error(error);
    }
})();