const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Получение списка инженеров (только пользователи с ролями engineer, engineer2, engineer3, engineer4, engineer5)
exports.getEngineers = async (req, res) => {
  try {
    console.log('👷 Получение списка инженеров');

    const query = `
      SELECT 
        id,
        "fullName",
        email,
        role
      FROM users
      WHERE role IN ('engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5')
      ORDER BY "fullName" ASC
    `;

    const engineers = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    console.log(`✅ Найдено инженеров: ${engineers.length}`);

    res.json({
      engineers
    });
  } catch (error) {
    console.error('❌ Ошибка получения инженеров:', error);
    res.status(500).json({ 
      message: 'Ошибка получения списка инженеров',
      error: error.message 
    });
  }
};

module.exports = {
  getEngineers: exports.getEngineers
};