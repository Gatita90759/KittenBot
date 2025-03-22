const Economy = require("../models/economy.js");

module.exports = {
  name: "balance",
  description: "Muestra tu saldo actual.",
  async execute(message) {
    const userID = message.author.id;

    let userData = await Economy.findOne({ userID });

    if (!userData) {
      userData = await Economy.create({ userID, balance: 0});
    }

    message.reply(`Tienes ${userData.balance} monedas.`);
  }
};