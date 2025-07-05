
const { QuickDB } = require('quick.db');
const db = new QuickDB();

// Obtener datos de un usuario
async function obtenerDatos(guildId, userId) {
  const key = `xp_${guildId}_${userId}`;
  return await db.get(key) || { xp: 0, nivel: 1 };
}

// Obtener top de usuarios
async function obtenerTop(guildId, limite = 10) {
  const datos = await db.all();
  
  // Filtrar solo datos de este servidor
  const datosServidor = datos
    .filter(item => item.id.startsWith(`xp_${guildId}_`))
    .map(item => ({
      userId: item.id.split('_')[2],
      ...item.value
    }))
    .sort((a, b) => {
      // Ordenar por nivel primero, luego por XP
      if (b.nivel !== a.nivel) {
        return b.nivel - a.nivel;
      }
      return b.xp - a.xp;
    })
    .slice(0, limite);
  
  return datosServidor;
}

module.exports = {
  obtenerDatos,
  obtenerTop
};
