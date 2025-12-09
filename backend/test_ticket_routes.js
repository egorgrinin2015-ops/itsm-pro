// test_ticket_routes.js - Детальная проверка ticketRoutes

console.log('🔍 Детальная проверка ticketRoutes...\n');

try {
  console.log('1️⃣ Проверка зависимостей...\n');
  
  const express = require('express');
  console.log('✅ express OK');
  
  const router = express.Router();
  console.log('✅ router создан, type:', typeof router);
  
  const ticketController = require('./controllers/ticketController');
  console.log('✅ ticketController OK, keys:', Object.keys(ticketController));
  
  const authMiddleware = require('./middleware/authMiddleware');
  console.log('✅ authMiddleware OK, type:', typeof authMiddleware);
  
  console.log('\n2️⃣ Загрузка ticketRoutes...\n');
  const ticketRoutes = require('./routes/ticketRoutes');
  
  console.log('✅ ticketRoutes загружен');
  console.log('   Type:', typeof ticketRoutes);
  console.log('   Constructor:', ticketRoutes.constructor?.name);
  console.log('   Keys:', Object.keys(ticketRoutes).slice(0, 10));
  
  if (typeof ticketRoutes === 'function') {
    console.log('✅ ПРАВИЛЬНО: ticketRoutes это функция (router)');
  } else {
    console.log('❌ ОШИБКА: ticketRoutes это НЕ функция!');
    console.log('   Экспортируется:', ticketRoutes);
  }
  
} catch (e) {
  console.log('❌ ОШИБКА:', e.message);
  console.log('Stack:', e.stack);
}