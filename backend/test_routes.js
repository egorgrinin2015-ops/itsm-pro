// test_routes.js - Проверка всех маршрутов

console.log('🔍 Проверка маршрутов...\n');

try {
  console.log('1️⃣ Проверка authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  console.log('✅ authRoutes OK, type:', typeof authRoutes);
  console.log('   Is function?', typeof authRoutes === 'function');
} catch (e) {
  console.log('❌ authRoutes ОШИБКА:', e.message);
}

try {
  console.log('\n2️⃣ Проверка categoryRoutes...');
  const categoryRoutes = require('./routes/categoryRoutes');
  console.log('✅ categoryRoutes OK, type:', typeof categoryRoutes);
  console.log('   Is function?', typeof categoryRoutes === 'function');
} catch (e) {
  console.log('❌ categoryRoutes ОШИБКА:', e.message);
}

try {
  console.log('\n3️⃣ Проверка ticketRoutes...');
  const ticketRoutes = require('./routes/ticketRoutes');
  console.log('✅ ticketRoutes OK, type:', typeof ticketRoutes);
  console.log('   Is function?', typeof ticketRoutes === 'function');
} catch (e) {
  console.log('❌ ticketRoutes ОШИБКА:', e.message);
}

try {
  console.log('\n4️⃣ Проверка commentRoutes...');
  const commentRoutes = require('./routes/commentRoutes');
  console.log('✅ commentRoutes OK, type:', typeof commentRoutes);
  console.log('   Is function?', typeof commentRoutes === 'function');
} catch (e) {
  console.log('❌ commentRoutes ОШИБКА:', e.message);
}

try {
  console.log('\n5️⃣ Проверка subtaskRoutes...');
  const subtaskRoutes = require('./routes/subtaskRoutes');
  console.log('✅ subtaskRoutes OK, type:', typeof subtaskRoutes);
  console.log('   Is function?', typeof subtaskRoutes === 'function');
} catch (e) {
  console.log('❌ subtaskRoutes ОШИБКА:', e.message);
}

try {
  console.log('\n6️⃣ Проверка statsRoutes...');
  const statsRoutes = require('./routes/statsRoutes');
  console.log('✅ statsRoutes OK, type:', typeof statsRoutes);
  console.log('   Is function?', typeof statsRoutes === 'function');
} catch (e) {
  console.log('❌ statsRoutes ОШИБКА:', e.message);
}

console.log('\n✅ Проверка завершена!');
console.log('\n💡 Все routes должны иметь type: function');