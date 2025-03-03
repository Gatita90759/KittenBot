
module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  prefix: 'kb!', // Update the prefix to '!'
  rewards: {
    // Add role IDs for different levels
    // Format: "level": "roleId"
    // Example: 5: "1234567890123456789"
  } // Add level rewards object for roles
};