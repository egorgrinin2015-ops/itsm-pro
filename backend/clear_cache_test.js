// clear_cache_test.js - Очистка кеша и проверка

console.log('🔄 Очистка кеша Node.js...\n');

// Очищаем кеш require
Object.keys(require.cache).forEach(key => {
  if (key.includes('ticketRoutes') || key.includes('ticketController')) {
    console.log('🗑️ Удаляем из кеша:', key);
    delete require.cache[key];
  }
});

console.log('\n✅ Кеш очищен!\n');

// Теперь загружаем заново
console.log('🔍 Загрузка ticketRoutes заново...\n');

try {
  const ticketRoutes = require('./routes/ticketRoutes');
  
  console.log('✅ ticketRoutes загружен');
  console.log('   Type:', typeof ticketRoutes);
  console.log('   Is function?', typeof ticketRoutes === 'function');
  
  if (typeof ticketRoutes === 'function') {
    console.log('\n✅✅✅ УСПЕХ! ticketRoutes теперь функция!\n');
  } else {
    console.log('\n❌ ПРОБЛЕМА ОСТАЕТСЯ');
    console.log('   Экспортируется:', ticketRoutes);
  }
  
} catch (e) {
  console.log('❌ ОШИБКА:', e.message);
}