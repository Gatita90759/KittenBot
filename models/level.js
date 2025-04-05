
const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  dailyStreak: { type: Number, default: 0 },
  lastDaily: { type: Date },
  totalMessages: { type: Number, default: 0 },
  voiceTime: { type: Number, default: 0 }, // Tiempo en minutos en canales de voz
  achievements: [{ type: String }], // Array de logros desbloqueados
  lastXPGain: { type: Date }, // Para el cooldown
  bonusMultiplier: { type: Number, default: 1 } // Multiplicador personal de XP
});

module.exports = mongoose.model("Level", levelSchema);
