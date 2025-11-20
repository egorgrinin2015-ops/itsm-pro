const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Получаем имя файла дампа из аргументов командной строки
const dumpFile = process.argv[2];

if (!dumpFile) {
  console.error('❌ Укажите файл дампа: npm run db:import filename.sql');
  process.exit(1);
}

const dumpPath = path.join(__dirname, dumpFile);

if (!fs.existsSync(dumpPath)) {
  console.error(`❌ Файл ${dumpFile} не найден в папке backend/`);
  process.exit(1);
}

console.log(`📥 Импорт дампа из файла: ${dumpFile}`);

// Команда для импорта в SQLite
const command = `sqlite3 database.sqlite < ${dumpFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Ошибка импорта: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`⚠️ Предупреждения: ${stderr}`);
  }
  
  console.log('✅ База данных успешно восстановлена!');
  console.log('🚀 Теперь можно запускать: npm run dev');
});