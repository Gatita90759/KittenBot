const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log('¡El bot está listo!');
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('¡Pong!');
  }
});

client.login(process.env.TOKEN);