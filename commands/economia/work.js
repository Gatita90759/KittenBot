const Economy = require("../models/economy.js");

module.exports = {
  name: "work",
  description: "Trabaja y gana monedas.",
  async execute(message) {
    const userID = message.author.id;

    // Tiempo mínimo de espera entre trabajos (en milisegundos)
    const cooldownWork = 20 * 60 * 1000; // 1 hora (puedes cambiar el tiempo aquí)

    let userData = await Economy.findOne({ userID });

    if (!userData) {
      userData = await Economy.create({ userID, balance: 100 });
    }

    // Verificar si el usuario ha trabajado recientemente
    const now = Date.now();
    if (userData.lastWorkedAt && now - userData.lastWorkedAt < cooldownWork) {
      const remainingTime = cooldowWork - (now - userData.lastWorkedAt);
      const minutes = Math.floor(remainingTime / 60000); // Convertir a minutos
      return message.reply(`Debes esperar ${minutes} minutos para volver a trabajar.`);
    }

    // Generar una cantidad aleatoria de monedas
    const amount = Math.floor(Math.random() * 100) + 50;

    // Actualizar el balance y la hora del último trabajo
    userData.balance += amount;
    userData.lastWorkedAt = now; // Actualizar el último momento de trabajo
    await userData.save();

    message.reply(`Trabajaste y ganaste ${amount} monedas. Ahora tienes ${userData.balance}.`);
  }
};