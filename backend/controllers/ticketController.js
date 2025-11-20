const { Ticket, User, ServiceCategory, Comment, Subtask } = require('../models');
const { Op } = require('sequelize');

// Генерация номера заявки
const generateTicketNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Ticket.count({
    where: {
      ticketNumber: {
        [Op.like]: `${year}%`
      }
    }
  });
  
  return `${year}${String(count + 1).padStart(6, '0')}`;
};

// Расчет SLA deadline
const calculateSlaDeadline = (slaTime) => {
  const now = new Date();
  return new Date(now.getTime() + slaTime * 60000); // slaTime в минутах
};

// Создание заявки
exports.createTicket = async (req, res) => {
  try {
    const { title, description, categoryId, userId, priority } = req.body;
    const initiatorId = req.user.id; // Кто создал заявку

    // Проверка категории
    const category = await ServiceCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    // Генерация номера заявки
    const ticketNumber = await generateTicketNumber();

    // Расчет SLA
    const slaDeadline = calculateSlaDeadline(category.slaTime);

    // Создание заявки
    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      categoryId,
      userId: userId || initiatorId, // Если не указан пользователь, то сам инициатор
      initiatorId,
      priority: priority || 'medium',
      slaDeadline
    });

    // Получение полной информации о заявке
    const fullTicket = await Ticket.findByPk(ticket.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'initiator', attributes: ['id', 'fullName', 'email'] },
        { model: ServiceCategory, as: 'category', attributes: ['id', 'name', 'slaTime'] }
      ]
    });

    res.status(201).json({
      message: 'Заявка успешно создана',
      ticket: fullTicket
    });

  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании заявки' });
  }
};

// Получение списка заявок
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, categoryId, assignedTo, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Формирование условий фильтрации
    const whereClause = {};

    // Пользователи видят только свои заявки
    if (userRole === 'user') {
      whereClause.userId = userId;
    }

    // Фильтры
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (categoryId) whereClause.categoryId = categoryId;
    if (assignedTo) whereClause.assignedTo = assignedTo;

    // Пагинация
    const offset = (page - 1) * limit;

    const { count, rows } = await Ticket.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'initiator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: ServiceCategory, as: 'category', attributes: ['id', 'name', 'slaTime'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      tickets: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении заявок' });
  }
};

// Получение одной заявки
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'initiator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: ServiceCategory, as: 'category' },
        { 
          model: Comment, 
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'fullName'] }],
          order: [['createdAt', 'ASC']]
        },
        {
          model: Subtask,
          as: 'subtasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'fullName'] }]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Проверка прав доступа
    if (userRole === 'user' && ticket.userId !== userId) {
      return res.status(403).json({ message: 'Нет доступа к этой заявке' });
    }

    res.json({ ticket });

  } catch (error) {
    console.error('Ошибка получения заявки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновление заявки
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo } = req.body;
    const userRole = req.user.role;

    // Только инженеры и менеджеры могут обновлять заявки
    if (userRole === 'user') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Обновление полей
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (status) {
      ticket.status = status;
      if (status === 'resolved' || status === 'closed') {
        ticket.resolvedAt = new Date();
      }
    }
    if (priority) ticket.priority = priority;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

    await ticket.save();

    // Получение обновленной заявки
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'initiator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: ServiceCategory, as: 'category' }
      ]
    });

    res.json({
      message: 'Заявка обновлена',
      ticket: updatedTicket
    });

  } catch (error) {
    console.error('Ошибка обновления заявки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удаление заявки
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Только менеджеры могут удалять заявки
    if (userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    await ticket.destroy();

    res.json({ message: 'Заявка удалена' });

  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};