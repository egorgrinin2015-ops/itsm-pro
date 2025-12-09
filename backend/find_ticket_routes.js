// find_ticket_routes.js - Найти какой файл загружается

console.log('🔍 Поиск ticketRoutes...\n');

try {
  const ticketRoutes = require('./routes/ticketRoutes');
  const resolvedPath = require.resolve('./routes/ticketRoutes');
  
  console.log('📁 Загружается файл:', resolvedPath);
  console.log('📊 Type:', typeof ticketRoutes);
  console.log('📦 Export:', ticketRoutes);
  
  console.log('\n📝 Читаем содержимое файла...\n');
  const fs = require('fs');
  const content = fs.readFileSync(resolvedPath, 'utf8');
  
  console.log('--- НАЧАЛО ФАЙЛА ---');
  console.log(content);
  console.log('--- КОНЕЦ ФАЙЛА ---');
  
  // Проверяем последнюю строку
  const lines = content.split('\n');
  const lastLine = lines[lines.length - 1].trim();
  const secondLastLine = lines[lines.length - 2]?.trim();
  
  console.log('\n📌 Последние строки:');
  console.log('  ', secondLastLine);
  console.log('  ', lastLine);
  
  if (lastLine === 'module.exports = router;') {
    console.log('\n✅ Экспорт правильный в файле!');
    console.log('❌ НО Node.js загружает неправильный объект!');
    console.log('🔧 Возможно проблема в ticketController.js!');
  } else {
    console.log('\n❌ Экспорт неправильный!');
    console.log('   Должно быть: module.exports = router;');
    console.log('   А написано:', lastLine);
  }
  
} catch (e) {
  console.log('❌ ОШИБКА:', e.message);
  console.log(e.stack);
}