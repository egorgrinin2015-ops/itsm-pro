const { sequelize, User, Ticket, Comment, Subtask, ServiceCategory } = require('../models');

const initDatabase = async () => {
  try {
    // Проверка подключения
    await sequelize.authenticate();
    console.log('✓ Подключение к базе данных установлено');

    // Синхронизация моделей (создание таблиц)
    await sequelize.sync({ force: false }); // force: true удалит все таблицы и создаст заново
    console.log('✓ Все модели синхронизированы с базой данных');

    return true;
  } catch (error) {
    console.error('✗ Ошибка при инициализации базы данных:', error);
    return false;
  }
};

module.exports = initDatabase;