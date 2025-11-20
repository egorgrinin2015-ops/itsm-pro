const { Comment, User, Ticket } = require('../models');

// Добавление комментария к заявке
exports.addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { text, isInternal } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Проверка существования заявки
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Пользователи могут видеть только свои заявки
    if (userRole === 'user' && ticket.userId !== userId) {
      return res.status(403).json({ message: 'Нет доступа к этой заявке' });
    }

    // Создание комментария
    const comment = await Comment.create({
      text,
      isInternal: isInternal && userRole !== 'user', // Пользователи не могут создавать внутренние комментарии
      ticketId,
      userId
    });

    // Получение комментария с информацией об авторе
    const fullComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'fullName', 'role'] }]
    });

    res.status(201).json({
      message: 'Комментарий добавлен',
      comment: fullComment
    });

  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получение комментариев заявки
exports.getComments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Проверка существования заявки
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Проверка прав доступа
    if (userRole === 'user' && ticket.userId !== userId) {
      return res.status(403).json({ message: 'Нет доступа к этой заявке' });
    }

    // Условие для фильтрации внутренних комментариев
    const whereClause = { ticketId };
    if (userRole === 'user') {
      whereClause.isInternal = false; // Пользователи не видят внутренние комментарии
    }

    const comments = await Comment.findAll({
      where: whereClause,
      include: [{ model: User, as: 'author', attributes: ['id', 'fullName', 'role'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json({ comments });

  } catch (error) {
    console.error('Ошибка получения комментариев:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удаление комментария
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    // Только автор или менеджер может удалить комментарий
    if (comment.userId !== userId && userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    await comment.destroy();

    res.json({ message: 'Комментарий удален' });

  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};