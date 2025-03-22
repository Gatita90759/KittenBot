const Economy = require("../models/economy.js");

module.exports = {
  name: "work",
  description: "Trabaja y gana monedas.",
  async execute(message) {
    const userID = message.author.id;
    const amount = Math.floor(Math.random() * 200) + 50; // Gana entre 50 y 250 monedas

    let userData = await Economy.findOne({ userID });

    if (!userData) {
      userData = await Economy.create({ userID, balance: amount });
    } else {
      userData.balance += amount;
      await userData.save();
    }

    message.reply(`Trabajaste y ganaste ${amount} monedas. Ahora tienes ${userData.balance}.`);
  }
};