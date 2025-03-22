const mongoose = require("mongoose");

const economySchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model("Economy", economySchema);