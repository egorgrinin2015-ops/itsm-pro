const { TimeLog, Ticket, User } = require('../models');
const { Op } = require('sequelize');

// Добавить лог времени к заявке
exports.addTimeLog = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { date, hoursSpent, description } = req.body;
    const userId = req.user.id;

    // Валидация
    if (!hoursSpent || hoursSpent <= 0) {
      return res.status(400).json({ 
        message: 'Укажите корректное время (больше 0)' 
      });
    }

    if (hoursSpent > 24) {
      return res.status(400).json({ 
        message: 'Время не может превышать 24 часа' 
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ 
        message: 'Описание обязательно' 
      });
    }

    // Проверяем существование заявки
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Создаём лог времени
    const timeLog = await TimeLog.create({
      ticketId,
      userId,
      date: date || new Date(),
      hoursSpent: parseFloat(hoursSpent),
      description: description.trim()
    });

    // Загружаем с пользователем
    await timeLog.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      message: 'Время успешно списано',
      timeLog
    });
  } catch (error) {
    console.error('Ошибка добавления лога времени:', error);
    res.status(500).json({ 
      message: 'Ошибка добавления лога времени',
      error: error.message 
    });
  }
};

// Получить все логи времени для заявки
exports.getTicketTimeLogs = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const timeLogs = await TimeLog.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    // Подсчитываем общее время
    const totalHours = timeLogs.reduce((sum, log) => {
      return sum + parseFloat(log.hoursSpent);
    }, 0);

    res.json({
      timeLogs,
      totalHours: totalHours.toFixed(2),
      count: timeLogs.length
    });
  } catch (error) {
    console.error('Ошибка получения логов времени:', error);
    res.status(500).json({ 
      message: 'Ошибка получения логов времени',
      error: error.message 
    });
  }
};

// Получить мои логи времени
exports.getMyTimeLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 50 } = req.query;

    const whereClause = { userId };

    // Фильтр по датам
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    const timeLogs = await TimeLog.findAll({
      where: whereClause,
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'ticketNumber', 'title', 'status']
        }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    // Подсчитываем общее время
    const totalHours = timeLogs.reduce((sum, log) => {
      return sum + parseFloat(log.hoursSpent);
    }, 0);

    res.json({
      timeLogs,
      totalHours: totalHours.toFixed(2),
      count: timeLogs.length
    });
  } catch (error) {
    console.error('Ошибка получения моих логов:', error);
    res.status(500).json({ 
      message: 'Ошибка получения логов времени',
      error: error.message 
    });
  }
};

// Получить статистику по времени (для менеджеров/админов)
exports.getTimeStats = async (req, res) => {
  try {
    const { startDate, endDate, userId, ticketId } = req.query;

    const whereClause = {};
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    if (userId) whereClause.userId = userId;
    if (ticketId) whereClause.ticketId = ticketId;

    const timeLogs = await TimeLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'role']
        },
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'ticketNumber', 'title', 'status', 'categoryId']
        }
      ],
      order: [['date', 'DESC']]
    });

    // Подсчитываем статистику
    const totalHours = timeLogs.reduce((sum, log) => {
      return sum + parseFloat(log.hoursSpent);
    }, 0);

    // Группируем по пользователям
    const byUser = {};
    timeLogs.forEach(log => {
      const userId = log.userId;
      if (!byUser[userId]) {
        byUser[userId] = {
          user: log.user,
          totalHours: 0,
          logsCount: 0
        };
      }
      byUser[userId].totalHours += parseFloat(log.hoursSpent);
      byUser[userId].logsCount += 1;
    });

    res.json({
      totalHours: totalHours.toFixed(2),
      totalLogs: timeLogs.length,
      byUser: Object.values(byUser),
      timeLogs
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ 
      message: 'Ошибка получения статистики',
      error: error.message 
    });
  }
};

// Удалить лог времени
exports.deleteTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const timeLog = await TimeLog.findByPk(id);

    if (!timeLog) {
      return res.status(404).json({ message: 'Лог времени не найден' });
    }

    // Только автор или админ/менеджер может удалить
    if (timeLog.userId !== userId && !['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({ 
        message: 'Нет прав на удаление этого лога' 
      });
    }

    await timeLog.destroy();

    res.json({ message: 'Лог времени удалён' });
  } catch (error) {
    console.error('Ошибка удаления лога времени:', error);
    res.status(500).json({ 
      message: 'Ошибка удаления лога времени',
      error: error.message 
    });
  }
};

// Обновить лог времени
exports.updateTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hoursSpent, description } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const timeLog = await TimeLog.findByPk(id);

    if (!timeLog) {
      return res.status(404).json({ message: 'Лог времени не найден' });
    }

    // Только автор или админ/менеджер может редактировать
    if (timeLog.userId !== userId && !['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого лога' 
      });
    }

    // Валидация
    if (hoursSpent !== undefined) {
      if (hoursSpent <= 0 || hoursSpent > 24) {
        return res.status(400).json({ 
          message: 'Время должно быть от 0.01 до 24 часов' 
        });
      }
      timeLog.hoursSpent = parseFloat(hoursSpent);
    }

    if (date !== undefined) {
      timeLog.date = date;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ 
          message: 'Описание не может быть пустым' 
        });
      }
      timeLog.description = description.trim();
    }

    await timeLog.save();

    // Загружаем с пользователем
    await timeLog.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'role']
        }
      ]
    });

    res.json({
      message: 'Лог времени обновлён',
      timeLog
    });
  } catch (error) {
    console.error('Ошибка обновления лога времени:', error);
    res.status(500).json({ 
      message: 'Ошибка обновления лога времени',
      error: error.message 
    });
  }
};