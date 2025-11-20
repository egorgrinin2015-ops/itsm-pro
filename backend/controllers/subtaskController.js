const { Subtask, User, Ticket } = require('../models');

// Создание подзадачи
exports.createSubtask = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { title, description, assignedTo } = req.body;
    const userRole = req.user.role;

    // Только инженеры и менеджеры могут создавать подзадачи
    if (userRole === 'user') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    // Проверка существования заявки
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const subtask = await Subtask.create({
      title,
      description,
      ticketId,
      assignedTo
    });

    // Получение подзадачи с информацией об исполнителе
    const fullSubtask = await Subtask.findByPk(subtask.id, {
      include: [{ model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] }]
    });

    res.status(201).json({
      message: 'Подзадача создана',
      subtask: fullSubtask
    });

  } catch (error) {
    console.error('Ошибка создания подзадачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получение подзадач заявки
exports.getSubtasks = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const subtasks = await Subtask.findAll({
      where: { ticketId },
      include: [{ model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json({ subtasks });

  } catch (error) {
    console.error('Ошибка получения подзадач:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновление подзадачи
exports.updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    const userRole = req.user.role;

    if (userRole === 'user') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const subtask = await Subtask.findByPk(id);

    if (!subtask) {
      return res.status(404).json({ message: 'Подзадача не найдена' });
    }

    if (title) subtask.title = title;
    if (description !== undefined) subtask.description = description;
    if (status) subtask.status = status;
    if (assignedTo !== undefined) subtask.assignedTo = assignedTo;

    await subtask.save();

    const updatedSubtask = await Subtask.findByPk(id, {
      include: [{ model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] }]
    });

    res.json({
      message: 'Подзадача обновлена',
      subtask: updatedSubtask
    });

  } catch (error) {
    console.error('Ошибка обновления подзадачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удаление подзадачи
exports.deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const subtask = await Subtask.findByPk(id);

    if (!subtask) {
      return res.status(404).json({ message: 'Подзадача не найдена' });
    }

    await subtask.destroy();

    res.json({ message: 'Подзадача удалена' });

  } catch (error) {
    console.error('Ошибка удаления подзадачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};