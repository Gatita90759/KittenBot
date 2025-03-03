
const fs = require('fs');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

// Función para crear un respaldo de la base de datos
async function createBackup() {
    try {
        const allData = await db.all();
        const levelData = allData.filter(entry => entry.id && entry.id.startsWith('level_'));
        
        if (levelData.length > 0) {
            const backupPath = `./backups/levels_backup_${Date.now()}.json`;
            
            // Crear directorio de respaldos si no existe
            if (!fs.existsSync('./backups')) {
                fs.mkdirSync('./backups');
            }
            
            // Guardar datos en archivo JSON
            fs.writeFileSync(backupPath, JSON.stringify(levelData, null, 2));
            console.log(`Respaldo creado en: ${backupPath}`);
        } else {
            console.log('No hay datos de niveles para respaldar');
        }
    } catch (error) {
        console.error('Error al crear respaldo:', error);
    }
}

// Función para restaurar desde un respaldo
async function restoreFromBackup(backupPath) {
    try {
        if (!fs.existsSync(backupPath)) {
            console.error('El archivo de respaldo no existe');
            return false;
        }
        
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        
        for (const entry of backupData) {
            await db.set(entry.id, entry.value);
        }
        
        console.log('Respaldo restaurado correctamente');
        return true;
    } catch (error) {
        console.error('Error al restaurar respaldo:', error);
        return false;
    }
}

module.exports = { createBackup, restoreFromBackup };
