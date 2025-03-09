
// Print environment variables for debugging
console.log('Cargando variables de entorno:');
console.log('TOKEN exists:', !!process.env.TOKEN);
console.log('CLIENT_ID exists:', !!process.env.CLIENT_ID);
console.log('GUILD_ID exists:', !!process.env.GUILD_ID);

// If GUILD_ID doesn't exist, show a warning
if (!process.env.GUILD_ID) {
  console.warn('⚠️ GUILD_ID no está definido en las variables de entorno');
}

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  prefix: 'kb!', // Prefix for regular commands
  rewards: {
    // Add role IDs for different levels
    // Format: "level": "roleId"
    // Example: 5: "1234567890123456789"
  } // Add level rewards object for roles
};
