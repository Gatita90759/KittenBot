
const levelConfig = {
  // Configuración de XP
  xp: {
    min: 5,           // XP mínimo por mensaje
    max: 25,           // XP máximo por mensaje
    cooldown: 60000,   // Tiempo entre mensajes para ganar XP (en ms)
    baseXP: 100,       // XP base para nivel 1
    multiplier: 1.8,   // Multiplicador de dificultad
    additional: 75     // XP adicional por nivel
  },
  
  // Roles por nivel
  roles: {
    5: "ID_ROL_NIVEL_5",
    10: "ID_ROL_NIVEL_10",
    15: "ID_ROL_NIVEL_15",
    20: "ID_ROL_NIVEL_20",
    25: "ID_ROL_NIVEL_25",
    30: "ID_ROL_NIVEL_30",
    50: "ID_ROL_NIVEL_50"
  },
  
  rewards: {
    5: "¡Desbloqueas el canal especial de niveles! 🌟",
    10: "¡Ahora puedes usar comandos especiales! 🎮",
    15: "¡Nuevo color de rol disponible! 🎨",
    20: "¡Acceso al canal VIP! 👑",
    25: "¡Multiplicador de XP x1.5! ⚡",
    30: "¡Insignia especial en tu perfil! 🏆",
    50: "¡Rol de Leyenda desbloqueado! 🌈"
  },
  
  // Mensajes personalizados
  messages: {
    levelUp: "¡{username} ha subido al nivel {level}! 🎉",
    roleEarned: "¡{username} ha desbloqueado el rol {role}! 🌟",
    xpGain: "¡{username} ha ganado {xp} XP!"
  },
  
  // Colores de la tarjeta
  cardColors: {
    background: '#2C2F33',
    progress: '#FF69B4',
    progressBg: '#484b4e',
    text: '#FFC0CB'
  }
};

module.exports = levelConfig;
