const mongoose = require("mongoose");

const economySchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  lastWorkedAt: { type: Date, default: null } // Nuevo campo para la fecha del último trabajo
});

module.exports = mongoose.model("Economy", economySchema);