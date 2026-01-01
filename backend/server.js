const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDatabase = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// МАРШРУТЫ ПОДКЛЮЧАЕМ ЗДЕСЬ
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');  
const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const statsRoutes = require('./routes/statsRoutes');
const kbRoutes = require('./routes/kbRoutes');
const slaRoutes = require('./routes/slaRoutes');
const userRoutes = require('./routes/userRoutes');
const timeLogRoutes = require('./routes/timeLogRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const auditRoutes = require('./routes/auditRoutes'); // ← НОВОЕ: аудит!

console.log('📦 Все маршруты загружены');

// ИСПОЛЬЗУЕМ МАРШРУТЫ
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/sla', slaRoutes);
app.use('/api/users', userRoutes);
app.use('/api', timeLogRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/audit', auditRoutes); // ← НОВОЕ: аудит!

console.log('✅ Все маршруты подключены');

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend работает!' });
});

// Тестовый маршрут для статистики
app.get('/api/stats/test', (req, res) => {
  res.json({ message: 'Статистика работает!', routes: ['overall', 'tickets-by-date', 'top-performers', 'sla-metrics'] });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Обработка несуществующих маршрутов (ДОЛЖНА БЫТЬ ПОСЛЕДНЕЙ!)
app.use((req, res) => {
  console.log('404 for:', req.method, req.path);
  res.status(404).json({ message: 'Маршрут не найден: ' + req.path });
});

// Инициализация базы данных и запуск сервера
const startServer = async () => {
  console.log('🔄 Инициализация базы данных...');
  
  const dbInitialized = await initDatabase();
  
  if (dbInitialized) {
    app.listen(PORT, () => {
      console.log(`\n✅ Сервер запущен на порту ${PORT}`);
      console.log(`📋 Тестовый маршрут: http://localhost:${PORT}/api/test`);
      console.log(`📊 Тест статистики: http://localhost:${PORT}/api/stats/test`);
      console.log('\n🛣️  Доступные маршруты:');
      console.log('   • /api/auth (авторизация)');
      console.log('   • /api/categories (категории)');  
      console.log('   • /api/tickets (заявки)');
      console.log('   • /api/comments (комментарии)');
      console.log('   • /api/subtasks (подзадачи)');
      console.log('   • /api/stats (статистика)');
      console.log('   • /api/kb (база знаний)');
      console.log('   • /api/sla (🎯 SLA!)');
      console.log('   • /api/users (👷 пользователи!)');
      console.log('   • /api/tickets/:id/time-logs (⏱️  учёт времени!)');
      console.log('   • /api/equipment (🖥️  инвентаризация CMDB!)');
      console.log('   • /api/audit (🔐 журнал аудита!)'); // ← НОВОЕ!
      console.log('\n🚀 Backend готов к работе!\n');
    });
  } else {
    console.error('❌ Не удалось инициализировать базу данных');
    process.exit(1);
  }
};

startServer();