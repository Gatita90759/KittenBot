
console.log('🔧 Cargando configuración...');
console.log('TOKEN:', process.env.TOKEN ? '✅' : '❌');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✅' : '❌');
console.log('GUILD_ID:', process.env.GUILD_ID ? '✅' : '❌');

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID
};
