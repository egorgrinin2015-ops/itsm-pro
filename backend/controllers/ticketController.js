const { Ticket, User, Category, Comment } = require('../models');
const { Op } = require('sequelize');
const auditService = require('../services/auditService');

// Проверка прав доступа для управления заявками
const canManageTicket = (userRole) => {
  return ['admin', 'manager', 'engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5'].includes(userRole);
};

// Получить все заявки с фильтрами
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, categoryId, search, myTickets, showClosed } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const whereClause = {};

    if (status) {
      const statusArray = status.includes(',') ? status.split(',').map(s => s.trim()) : [status];
      whereClause.status = { [Op.in]: statusArray };
    } else if (showClosed === 'true' && req.query.onlyClosed === 'true') {
      whereClause.status = 'closed';
    } else if (showClosed !== 'true') {
      whereClause.status = { [Op.ne]: 'closed' };
    }

    if (priority) {
      const priorityArray = priority.includes(',') ? priority.split(',').map(p => p.trim()) : [priority];
      whereClause.priority = { [Op.in]: priorityArray };
    }

    if (categoryId) {
      const categoryArray = categoryId.includes(',') ? categoryId.split(',').map(c => parseInt(c.trim(), 10)) : [parseInt(categoryId, 10)];
      whereClause.categoryId = { [Op.in]: categoryArray };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (myTickets === 'true' && canManageTicket(userRole)) {
      whereClause.assignedTo = userId;
    }

    if (userRole === 'user') {
      whereClause.userId = userId;
    }

    const tickets = await Ticket.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'description'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      creatorName: ticket.creator?.fullName || 'Неизвестно',
      creatorEmail: ticket.creator?.email || '',
      categoryName: ticket.category?.name || 'Без категории',
      categoryId: ticket.categoryId,
      assignedTo: ticket.assignedToUser ? {
        id: ticket.assignedToUser.id,
        fullName: ticket.assignedToUser.fullName,
        email: ticket.assignedToUser.email
      } : null
    }));

    res.json({ tickets: formattedTickets });
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ message: 'Ошибка получения заявок', error: error.message });
  }
};

// Получить заявку по ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'description'] }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    if (userRole === 'user' && ticket.userId !== userId) {
      return res.status(403).json({ message: 'Нет доступа к этой заявке' });
    }

    const formattedTicket = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      creatorName: ticket.creator?.fullName || 'Неизвестно',
      creatorEmail: ticket.creator?.email || '',
      categoryName: ticket.category?.name || 'Без категории',
      categoryId: ticket.categoryId,
      assignedTo: ticket.assignedToUser ? {
        id: ticket.assignedToUser.id,
        fullName: ticket.assignedToUser.fullName,
        email: ticket.assignedToUser.email
      } : null
    };

    res.json(formattedTicket);
  } catch (error) {
    console.error('Ошибка получения заявки:', error);
    res.status(500).json({ message: 'Ошибка получения заявки', error: error.message });
  }
};

// Создать новую заявку
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, categoryId, autoAssign } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Заголовок и описание обязательны' });
    }

    const lastTicket = await Ticket.findOne({ order: [['id', 'DESC']], attributes: ['id'] });
    const nextId = lastTicket ? lastTicket.id + 1 : 1;
    const ticketNumber = `TICKET-${String(nextId).padStart(6, '0')}`;

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      priority: priority || 'medium',
      categoryId: categoryId || null,
      userId: userId,
      initiatorId: userId,
      status: 'new'
    });

    // 📝 АУДИТ: Создание заявки
    await auditService.logCreate(req, 'ticket', ticket.id, ticket.title, {
      priority: ticket.priority,
      status: ticket.status
    });

    let assignmentResult = null;
    if (autoAssign === true || autoAssign === 'true') {
      const { autoAssignTicket } = require('../services/autoAssignService');
      try {
        assignmentResult = await autoAssignTicket(ticket.id);
        await ticket.reload();
      } catch (autoAssignError) {
        console.error('Ошибка автоназначения:', autoAssignError);
      }
    }

    await ticket.reload({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'description'] }
      ]
    });

    res.status(201).json({
      message: 'Заявка успешно создана',
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        creatorName: ticket.creator?.fullName,
        categoryName: ticket.category?.name || 'Без категории',
        assignedTo: ticket.assignedToUser ? {
          id: ticket.assignedToUser.id,
          fullName: ticket.assignedToUser.fullName,
          email: ticket.assignedToUser.email
        } : null
      },
      autoAssignment: assignmentResult
    });
  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    res.status(500).json({ message: 'Ошибка создания заявки', error: error.message });
  }
};

// Обновить статус заявки
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    if (!canManageTicket(userRole)) {
      return res.status(403).json({ message: 'Недостаточно прав для изменения статуса' });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const validStatuses = ['new', 'in_progress', 'on_hold', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус' });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved' || status === 'closed') {
      if (!ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
      }
    }

    await ticket.save();

    // 📝 АУДИТ: Изменение статуса
    await auditService.logStatusChange(req, 'ticket', ticket.id, ticket.title, oldStatus, status);

    res.json({
      message: 'Статус заявки обновлён',
      ticket: { id: ticket.id, status: ticket.status, resolvedAt: ticket.resolvedAt }
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ message: 'Ошибка обновления статуса', error: error.message });
  }
};

// Назначить исполнителя
exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { engineerId } = req.body;
    const userRole = req.user.role;

    if (!canManageTicket(userRole)) {
      return res.status(403).json({ message: 'Недостаточно прав для назначения исполнителя' });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const engineer = await User.findByPk(engineerId);
    if (!engineer) {
      return res.status(404).json({ message: 'Инженер не найден' });
    }

    if (!canManageTicket(engineer.role)) {
      return res.status(400).json({ message: 'Указанный пользователь не является инженером' });
    }

    ticket.assignedTo = engineerId;
    await ticket.save();

    // 📝 АУДИТ: Назначение исполнителя
    await auditService.logAssign(req, 'ticket', ticket.id, ticket.title, engineer.fullName);

    await ticket.reload({
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'fullName', 'email'] }]
    });

    res.json({
      message: 'Исполнитель назначен',
      ticket: {
        id: ticket.id,
        assignedTo: ticket.assignedToUser ? {
          id: ticket.assignedToUser.id,
          fullName: ticket.assignedToUser.fullName,
          email: ticket.assignedToUser.email
        } : null
      }
    });
  } catch (error) {
    console.error('Ошибка назначения исполнителя:', error);
    res.status(500).json({ message: 'Ошибка назначения исполнителя', error: error.message });
  }
};

// Обновить заявку
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, categoryId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    if (userRole === 'user' && ticket.userId !== userId) {
      return res.status(403).json({ message: 'Нет прав для редактирования этой заявки' });
    }

    const oldValues = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      categoryId: ticket.categoryId
    };

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    if (categoryId !== undefined) ticket.categoryId = categoryId;

    await ticket.save();

    // 📝 АУДИТ: Обновление заявки
    await auditService.logUpdate(req, 'ticket', ticket.id, ticket.title, oldValues, {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      categoryId: ticket.categoryId
    });

    res.json({
      message: 'Заявка обновлена',
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        categoryId: ticket.categoryId
      }
    });
  } catch (error) {
    console.error('Ошибка обновления заявки:', error);
    res.status(500).json({ message: 'Ошибка обновления заявки', error: error.message });
  }
};

// Удалить заявку
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'admin' && userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав для удаления заявки' });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const ticketTitle = ticket.title;

    // 📝 АУДИТ: Удаление заявки
    await auditService.logDelete(req, 'ticket', ticket.id, ticketTitle, {
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority
    });

    await ticket.destroy();

    res.json({ message: 'Заявка удалена' });
  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    res.status(500).json({ message: 'Ошибка удаления заявки', error: error.message });
  }
};

// Получить статистику заявок
exports.getTicketStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = {};
    if (userRole === 'user') {
      whereClause.userId = userId;
    }
    whereClause.status = { [Op.ne]: 'closed' };

    const [totalTickets, newTickets, inProgressTickets, onHoldTickets, resolvedTickets] = await Promise.all([
      Ticket.count({ where: whereClause }),
      Ticket.count({ where: { ...whereClause, status: 'new' } }),
      Ticket.count({ where: { ...whereClause, status: 'in_progress' } }),
      Ticket.count({ where: { ...whereClause, status: 'on_hold' } }),
      Ticket.count({ where: { ...whereClause, status: 'resolved' } })
    ]);

    const closedTickets = await Ticket.count({ 
      where: { ...(userRole === 'user' ? { userId: userId } : {}), status: 'closed' } 
    });

    res.json({
      total: totalTickets,
      new: newTickets,
      in_progress: inProgressTickets,
      on_hold: onHoldTickets,
      resolved: resolvedTickets,
      closed: closedTickets
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка получения статистики', error: error.message });
  }
};

// Получить статистику загруженности инженеров
exports.getEngineersLoad = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (!['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({ message: 'Недостаточно прав для просмотра загруженности инженеров' });
    }

    const { getEngineersLoadStats } = require('../services/autoAssignService');
    const stats = await getEngineersLoadStats();

    res.json({ engineers: stats, timestamp: new Date() });
  } catch (error) {
    console.error('Ошибка получения загруженности инженеров:', error);
    res.status(500).json({ message: 'Ошибка получения загруженности инженеров', error: error.message });
  }
};

module.exports = exports;