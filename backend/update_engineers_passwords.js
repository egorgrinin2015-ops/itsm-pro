const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');

// Скрипт для обновления паролей инженеров
async function updateEngineersPasswords() {
  try {
    console.log('🔐 Начинаем обновление паролей инженеров...');

    // Хешируем пароль "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('✅ Пароль захеширован:', hashedPassword);

    const engineers = [
      { email: 'engineer2@itsm.com', name: 'Иван Петров' },
      { email: 'engineer3@itsm.com', name: 'Мария Сидорова' },
      { email: 'engineer4@itsm.com', name: 'Дмитрий Козлов' },
      { email: 'engineer5@itsm.com', name: 'Елена Морозова' }
    ];

    for (const engineer of engineers) {
      try {
        // Обновляем пароль
        await sequelize.query(
          'UPDATE users SET password = :password WHERE email = :email',
          {
            replacements: {
              password: hashedPassword,
              email: engineer.email
            },
            type: QueryTypes.UPDATE
          }
        );

        console.log(`✅ Пароль обновлён для ${engineer.name} (${engineer.email})`);
      } catch (err) {
        console.error(`❌ Ошибка обновления пароля для ${engineer.name}:`, err.message);
      }
    }

    // Проверяем всех инженеров
    console.log('\n📋 Список всех инженеров:');
    const allEngineers = await sequelize.query(
      `SELECT id, username, "fullName", email, role 
       FROM users 
       WHERE role IN ('engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5')
       ORDER BY role`,
      { type: QueryTypes.SELECT }
    );

    console.table(allEngineers);
    console.log(`\n✅ Всего инженеров: ${allEngineers.length}`);
    console.log('\n🔐 Пароль для всех: password123');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔚 Завершено');
    process.exit(0);
  }
}

// Запускаем скрипт
updateEngineersPasswords();