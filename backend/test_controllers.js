// test_controllers.js - Проверка всех контроллеров

console.log('🔍 Проверка контроллеров...\n');

try {
  console.log('1️⃣ Проверка ticketController...');
  const ticketController = require('./controllers/ticketController');
  console.log('✅ ticketController OK:', Object.keys(ticketController));
} catch (e) {
  console.log('❌ ticketController ОШИБКА:', e.message);
}

try {
  console.log('\n2️⃣ Проверка authController...');
  const authController = require('./controllers/authController');
  console.log('✅ authController OK:', Object.keys(authController));
} catch (e) {
  console.log('❌ authController ОШИБКА:', e.message);
}

try {
  console.log('\n3️⃣ Проверка categoryController...');
  const categoryController = require('./controllers/categoryController');
  console.log('✅ categoryController OK:', Object.keys(categoryController));
} catch (e) {
  console.log('❌ categoryController ОШИБКА:', e.message);
}

try {
  console.log('\n4️⃣ Проверка commentController...');
  const commentController = require('./controllers/commentController');
  console.log('✅ commentController OK:', Object.keys(commentController));
} catch (e) {
  console.log('❌ commentController ОШИБКА:', e.message);
}

try {
  console.log('\n5️⃣ Проверка subtaskController...');
  const subtaskController = require('./controllers/subtaskController');
  console.log('✅ subtaskController OK:', Object.keys(subtaskController));
} catch (e) {
  console.log('❌ subtaskController ОШИБКА:', e.message);
}

try {
  console.log('\n6️⃣ Проверка statsController...');
  const statsController = require('./controllers/statsController');
  console.log('✅ statsController OK:', Object.keys(statsController));
} catch (e) {
  console.log('❌ statsController ОШИБКА:', e.message);
}

console.log('\n✅ Проверка завершена!');