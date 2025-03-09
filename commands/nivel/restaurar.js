const { restoreFromBackup } = require('../backupSystem.js');
const fs = require('fs');

module.exports = {
  name: 'restaurar',
  description: 'Restaura los niveles desde un respaldo',
  async execute(message, args) {
    // Verificar si el usuario es administrador
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('❌ Solo los administradores pueden usar este comando.');
    }

    try {
      // Listar archivos de respaldo disponibles
      const backupDir = './backups';

      if (!fs.existsSync(backupDir)) {
        return message.reply('❌ No hay respaldos disponibles.');
      }

      const backups = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('levels_backup_'))
        .sort((a, b) => {
          // Ordenar por fecha (más reciente primero)
          const timeA = parseInt(a.split('_').pop().replace('.json', ''));
          const timeB = parseInt(b.split('_').pop().replace('.json', ''));
          return timeB - timeA;
        });

      if (backups.length === 0) {
        return message.reply('❌ No hay respaldos disponibles.');
      }

      // Si no se especifica un archivo, usar el más reciente
      const backupFile = args[0] ? args[0] : backups[0];
      const backupPath = `${backupDir}/${backupFile}`;

      message.reply(`⏳ Restaurando desde respaldo: ${backupFile}...`);

      const success = await restoreFromBackup(backupPath);

      if (success) {
        message.reply('✅ Respaldo restaurado correctamente.');
      } else {
        message.reply('❌ Error al restaurar el respaldo.');
      }
    } catch (error) {
      console.error('Error en comando restaurar:', error);
      message.reply('❌ Ocurrió un error al restaurar el respaldo.');
    }
  }
};
