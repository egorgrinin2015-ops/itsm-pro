const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auditService = require('../services/auditService');

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    console.log('📝 Попытка регистрации:', { username, email, role });

    // Проверка существования пользователя
    const existingUser = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ email }, { username }] 
      } 
    });

    if (existingUser) {
      console.log('❌ Пользователь уже существует');
      return res.status(400).json({ 
        message: 'Пользователь с таким email или username уже существует' 
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'user',
      isActive: true
    });

    console.log('✅ Пользователь зарегистрирован:', user.email);

    // 📝 АУДИТ: Регистрация пользователя
    await auditService.logCreate(req, 'user', user.id, user.fullName, {
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Попытка входа для:', email);
    console.log('📧 Email:', email);
    console.log('🔑 Password длина:', password?.length);

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });

    console.log('👤 Пользователь найден:', user ? 'ДА' : 'НЕТ');
    
    if (user) {
      console.log('📋 Данные пользователя:', {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        passwordHash: user.password ? user.password.substring(0, 20) + '...' : 'НЕТ'
      });
    }

    if (!user) {
      console.log('❌ Пользователь не найден в БД');
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    console.log('🔐 Проверяем пароль...');
    console.log('🔐 Хеш из БД:', user.password.substring(0, 30) + '...');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('✅ Пароль валиден:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Пароль не совпадает');
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка активности пользователя
    console.log('🔍 Проверка isActive:', user.isActive);
    if (user.isActive === false) {
      console.log('❌ Аккаунт деактивирован');
      return res.status(403).json({ message: 'Аккаунт деактивирован' });
    }

    // Создание токена
    console.log('🎫 Создаём токен...');
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Вход успешен для:', user.email);
    console.log('🎫 Токен создан:', token.substring(0, 20) + '...');

    // 📝 АУДИТ: Вход в систему
    await auditService.logLogin(req, user.id, user.fullName);

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ ОШИБКА ВХОДА:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
};

// Получение информации о текущем пользователе
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};