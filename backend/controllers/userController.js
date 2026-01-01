const { User } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const auditService = require('../services/auditService');

// Получение списка инженеров
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

    res.json({ engineers });
  } catch (error) {
    console.error('❌ Ошибка получения инженеров:', error);
    res.status(500).json({ 
      message: 'Ошибка получения списка инженеров',
      error: error.message 
    });
  }
};

// Получение всех пользователей с фильтрами
exports.getAllUsers = async (req, res) => {
  try {
    console.log('👥 Получение списка всех пользователей');
    
    const { role, isActive, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }
    
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const validSortFields = ['createdAt', 'fullName', 'email', 'role', 'lastLoginAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'username', 'email', 'fullName', 'role', 'isActive', 'createdAt', 'updatedAt', 'lastLoginAt'],
      order: [[orderField, order]]
    });
    
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {
        user: users.filter(u => u.role === 'user').length,
        engineer: users.filter(u => u.role.startsWith('engineer')).length,
        manager: users.filter(u => u.role === 'manager').length,
        admin: users.filter(u => u.role === 'admin').length
      }
    };
    
    console.log(`✅ Найдено пользователей: ${users.length}`);
    
    res.json({ users, stats });
  } catch (error) {
    console.error('❌ Ошибка получения пользователей:', error);
    res.status(500).json({ 
      message: 'Ошибка получения списка пользователей',
      error: error.message 
    });
  }
};

// Получение пользователя по ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'fullName', 'role', 'isActive', 'createdAt', 'updatedAt', 'lastLoginAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Ошибка получения пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка получения пользователя',
      error: error.message 
    });
  }
};

// Создание пользователя
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }
    
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Пользователь с таким email уже существует'
          : 'Пользователь с таким username уже существует'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'user',
      isActive: true
    });
    
    console.log(`✅ Создан пользователь: ${user.fullName} (${user.email})`);
    
    // 📝 АУДИТ: Создание пользователя
    await auditService.logCreate(req, 'user', user.id, user.fullName, {
      email: user.email,
      role: user.role
    });
    
    res.status(201).json({
      message: 'Пользователь успешно создан',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка создания пользователя',
      error: error.message 
    });
  }
};

// Обновление пользователя
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, password } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }
    }
    
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Пользователь с таким username уже существует' });
      }
    }
    
    // Сохраняем старые значения для аудита
    const oldValues = {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (role) user.role = role;
    
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    
    console.log(`✅ Обновлён пользователь: ${user.fullName}`);
    
    // 📝 АУДИТ: Обновление пользователя
    await auditService.logUpdate(req, 'user', user.id, user.fullName, oldValues, {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
    
    res.json({
      message: 'Пользователь успешно обновлён',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Ошибка обновления пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка обновления пользователя',
      error: error.message 
    });
  }
};

// Блокировка/разблокировка пользователя
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Нельзя заблокировать самого себя' });
    }
    
    const oldStatus = user.isActive;
    user.isActive = !user.isActive;
    await user.save();
    
    const action = user.isActive ? 'разблокирован' : 'заблокирован';
    console.log(`✅ Пользователь ${user.fullName} ${action}`);
    
    // 📝 АУДИТ: Изменение статуса пользователя
    await auditService.logStatusChange(req, 'user', user.id, user.fullName, 
      oldStatus ? 'active' : 'blocked', 
      user.isActive ? 'active' : 'blocked'
    );
    
    res.json({
      message: `Пользователь успешно ${action}`,
      user: {
        id: user.id,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('❌ Ошибка изменения статуса пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка изменения статуса пользователя',
      error: error.message 
    });
  }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Нельзя удалить самого себя' });
    }
    
    const userName = user.fullName;
    const userEmail = user.email;
    
    // 📝 АУДИТ: Удаление пользователя
    await auditService.logDelete(req, 'user', user.id, userName, {
      email: userEmail,
      role: user.role
    });
    
    await user.destroy();
    
    console.log(`✅ Удалён пользователь: ${userName}`);
    
    res.json({ message: 'Пользователь успешно удалён' });
  } catch (error) {
    console.error('❌ Ошибка удаления пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка удаления пользователя',
      error: error.message 
    });
  }
};

// Сброс пароля пользователя
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    console.log(`✅ Сброшен пароль для: ${user.fullName}`);
    
    // 📝 АУДИТ: Сброс пароля
    await auditService.logUpdate(req, 'user', user.id, user.fullName, 
      { password: '***' }, 
      { password: '*** (сброшен)' }
    );
    
    res.json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('❌ Ошибка сброса пароля:', error);
    res.status(500).json({ 
      message: 'Ошибка сброса пароля',
      error: error.message 
    });
  }
};

module.exports = exports;