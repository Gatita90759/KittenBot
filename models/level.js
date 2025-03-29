
const mongoose = require("mongoose");

// Eto e, idk x2

const levelSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 }
});

module.exports = mongoose.model("Level", levelSchema);
