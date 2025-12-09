const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');

// Скрипт для добавления статуса on_hold в ENUM
async function addOnHoldStatus() {
  try {
    console.log('🔄 Начинаем добавление статуса "on_hold" в ENUM...');

    // Проверяем текущие статусы
    console.log('\n📋 Текущие статусы в ENUM:');
    const currentStatuses = await sequelize.query(
      `SELECT enumlabel AS status
       FROM pg_enum
       WHERE enumtypid = 'enum_tickets_status'::regtype
       ORDER BY enumsortorder`,
      { type: QueryTypes.SELECT }
    );
    console.table(currentStatuses);

    // Проверяем существует ли статус
    const exists = currentStatuses.some(s => s.status === 'on_hold');
    
    if (exists) {
      console.log('⚠️  Статус "on_hold" уже существует');
    } else {
      // Добавляем статус
      await sequelize.query(
        `ALTER TYPE enum_tickets_status ADD VALUE 'on_hold'`,
        { type: QueryTypes.RAW }
      );
      
      console.log('✅ Статус "on_hold" добавлен успешно');
    }

    // Проверяем обновлённый список статусов
    console.log('\n📋 Обновлённый список статусов в ENUM:');
    const updatedStatuses = await sequelize.query(
      `SELECT enumlabel AS status
       FROM pg_enum
       WHERE enumtypid = 'enum_tickets_status'::regtype
       ORDER BY enumsortorder`,
      { type: QueryTypes.SELECT }
    );
    console.table(updatedStatuses);

    console.log(`\n✅ Всего статусов: ${updatedStatuses.length}`);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔚 Завершено');
    process.exit(0);
  }
}

// Запускаем скрипт
addOnHoldStatus();