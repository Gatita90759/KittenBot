
const { REST, Routes } = require('discord.js');
const config = require('./config.js');

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Eliminando comando específico...');
        const commands = await rest.get(Routes.applicationCommands(config.CLIENT_ID));

        const commandToDelete = commands.find(cmd => cmd.name === 'active-dev-badge');

        if (commandToDelete) {
            await rest.delete(Routes.applicationCommand(config.CLIENT_ID, commandToDelete.id));
            console.log(`Comando /active-dev-badge eliminado.`);
        } else {
            console.log('No se encontró el comando.');
        }
    } catch (error) {
        console.error(error);
    }
})();
