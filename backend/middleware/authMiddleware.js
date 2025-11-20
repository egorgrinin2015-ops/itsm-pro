const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Получение токена из заголовка
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    // Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Добавление данных пользователя в запрос
    req.user = decoded;
    
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

module.exports = authMiddleware;