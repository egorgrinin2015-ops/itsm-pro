const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Получение всех заявок с фильтрами
exports.getTickets = async (req, res) => {
  try {
    console.log('🔍 Получены параметры фильтров:', req.query);

    let query = `
      SELECT 
        t.*,
        u."fullName" as "creatorName",
        c.name as "categoryName",
        CASE 
          WHEN t."resolvedAt" IS NOT NULL THEN
            CASE 
              WHEN t."resolvedAt" <= t."slaDeadline" THEN 'met'
              ELSE 'breached'
            END
          WHEN NOW() > t."slaDeadline" THEN 'breached'
          WHEN t."slaDeadline" - NOW() <= INTERVAL '1 hour' THEN 'warning'
          ELSE 'ok'
        END as "slaStatus"
      FROM tickets t
      LEFT JOIN users u ON t."userId" = u.id
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      WHERE 1=1
    `;
    const replacements = {};
    let paramCounter = 0;

    // ПОИСК
    if (req.query.search && req.query.search.trim()) {
      console.log('🔍 Применяется поиск:', req.query.search);
      paramCounter++;
      query += ` AND (
        t.title ILIKE :search${paramCounter} OR 
        t.description ILIKE :search${paramCounter} OR 
        CAST(t.id AS TEXT) ILIKE :search${paramCounter}
      )`;
      replacements[`search${paramCounter}`] = `%${req.query.search.trim()}%`;
    }

    // СТАТУСЫ
    if (req.query.status && req.query.status.trim()) {
      const statuses = req.query.status.split(',').filter(s => s.trim());
      if (statuses.length > 0) {
        console.log('📊 Фильтр по статусам:', statuses);
        const placeholders = statuses.map((_, i) => `:status${paramCounter}_${i}`).join(', ');
        query += ` AND t.status IN (${placeholders})`;
        statuses.forEach((status, i) => {
          replacements[`status${paramCounter}_${i}`] = status;
        });
        paramCounter++;
      }
    }

    // ПРИОРИТЕТЫ
    if (req.query.priority && req.query.priority.trim()) {
      const priorities = req.query.priority.split(',').filter(p => p.trim());
      if (priorities.length > 0) {
        console.log('⚡ Фильтр по приоритетам:', priorities);
        const placeholders = priorities.map((_, i) => `:priority${paramCounter}_${i}`).join(', ');
        query += ` AND t.priority IN (${placeholders})`;
        priorities.forEach((priority, i) => {
          replacements[`priority${paramCounter}_${i}`] = priority;
        });
        paramCounter++;
      }
    }

    // КАТЕГОРИИ
    if (req.query.categoryId && req.query.categoryId.trim()) {
      const categoryIds = req.query.categoryId.split(',').map(c => parseInt(c.trim()));
      if (categoryIds.length > 0) {
        console.log('📂 Фильтр по категориям:', categoryIds);
        const placeholders = categoryIds.map((_, i) => `:categoryId${paramCounter}_${i}`).join(', ');
        query += ` AND t."categoryId" IN (${placeholders})`;
        categoryIds.forEach((id, i) => {
          replacements[`categoryId${paramCounter}_${i}`] = id;
        });
        paramCounter++;
      }
    }

    // ДАТА
    let dateRange = req.query['dateRange[]'] || req.query.dateRange;
    
    if (dateRange) {
      if (typeof dateRange === 'string') {
        dateRange = dateRange.split(',').map(n => parseInt(n.trim()));
      } else if (Array.isArray(dateRange)) {
        dateRange = dateRange.map(n => parseInt(n));
      }
      
      if (dateRange && dateRange.length === 2) {
        const [minDays, maxDays] = dateRange;
        console.log(`📅 Фильтр по дате: ${minDays}-${maxDays} дней назад`);
        
        paramCounter++;
        query += ` AND t."createdAt" >= NOW() - INTERVAL '1 day' * :maxDays${paramCounter}`;
        replacements[`maxDays${paramCounter}`] = maxDays;
        
        if (minDays > 0) {
          paramCounter++;
          query += ` AND t."createdAt" <= NOW() - INTERVAL '1 day' * :minDays${paramCounter}`;
          replacements[`minDays${paramCounter}`] = minDays;
        }
      }
    }

    // ИСПОЛНИТЕЛЬ
    if (req.query.assignedTo && req.query.assignedTo.trim()) {
      const assignedIds = req.query.assignedTo.split(',').map(a => parseInt(a.trim()));
      if (assignedIds.length > 0) {
        console.log('👤 Фильтр по исполнителям:', assignedIds);
        const placeholders = assignedIds.map((_, i) => `:assignedTo${paramCounter}_${i}`).join(', ');
        query += ` AND t."assignedTo" IN (${placeholders})`;
        assignedIds.forEach((id, i) => {
          replacements[`assignedTo${paramCounter}_${i}`] = id;
        });
        paramCounter++;
      }
    }

    // ПАГИНАЦИЯ
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    console.log(`📄 Пагинация: страница ${page}, лимит ${limit}`);

    // COUNT
    const countQuery = query.replace(/SELECT.*?FROM/s, 'SELECT COUNT(*) as total FROM');
    
    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    
    const total = countResult[0]?.total || 0;
    console.log(`✅ Найдено заявок: ${total}`);

    // LIMIT OFFSET
    query += ` ORDER BY t."createdAt" DESC LIMIT :limit OFFSET :offset`;
    replacements.limit = limit;
    replacements.offset = offset;

    // РЕЗУЛЬТАТ
    const tickets = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    console.log(`✅ Возвращено заявок: ${tickets.length}`);

    res.json({
      tickets,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Ошибка получения заявок:', error);
    res.status(500).json({ 
      message: 'Ошибка получения заявок',
      error: error.message 
    });
  }
};

// Получение одной заявки
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        t.*,
        u."fullName" as "creatorName",
        u.email as "creatorEmail",
        c.name as "categoryName",
        c."slaTime" as "slaMinutes",
        eng."fullName" as "engineerName",
        CASE 
          WHEN t."resolvedAt" IS NOT NULL THEN
            CASE 
              WHEN t."resolvedAt" <= t."slaDeadline" THEN 'met'
              ELSE 'breached'
            END
          WHEN NOW() > t."slaDeadline" THEN 'breached'
          WHEN t."slaDeadline" - NOW() <= INTERVAL '1 hour' THEN 'warning'
          ELSE 'ok'
        END as "slaStatus",
        CASE 
          WHEN t."resolvedAt" IS NULL THEN
            EXTRACT(EPOCH FROM (t."slaDeadline" - NOW())) / 60
          ELSE
            EXTRACT(EPOCH FROM (t."slaDeadline" - t."resolvedAt")) / 60
        END as "slaRemainingMinutes"
      FROM tickets t
      LEFT JOIN users u ON t."userId" = u.id
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      LEFT JOIN users eng ON t."assignedTo" = eng.id
      WHERE t.id = :id
    `;
    
    const tickets = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
    
    res.json(tickets[0]);
  } catch (error) {
    console.error('Ошибка получения заявки:', error);
    res.status(500).json({ 
      message: 'Ошибка получения заявки',
      error: error.message 
    });
  }
};

// Создание заявки с автоматическим расчетом SLA
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, categoryId } = req.body;
    const userId = req.user.id;

    console.log('📝 Создание заявки:', { title, description, priority, categoryId, userId });

    if (!title || !description) {
      return res.status(400).json({ 
        message: 'Необходимо указать название и описание заявки' 
      });
    }

    // Получаем SLA время категории
    let slaMinutes = 120; // По умолчанию 2 часа
    if (categoryId) {
      const categoryResult = await sequelize.query(
        'SELECT "slaTime" FROM service_categories WHERE id = :categoryId',
        { 
          replacements: { categoryId },
          type: QueryTypes.SELECT 
        }
      );
      if (categoryResult.length > 0) {
        slaMinutes = categoryResult[0].slaTime;
      }
    }

    // Рассчитываем SLA deadline
    const slaDeadline = new Date(Date.now() + slaMinutes * 60 * 1000);

    // Генерируем номер заявки
    const ticketNumber = `TICKET-${Date.now()}`;

    const query = `
      INSERT INTO tickets (
        "ticketNumber", title, description, priority, "categoryId", "userId", 
        "initiatorId", status, "slaDeadline", "createdAt", "updatedAt"
      ) VALUES (
        :ticketNumber, :title, :description, :priority, :categoryId, :userId, 
        :initiatorId, 'new', :slaDeadline, NOW(), NOW()
      ) RETURNING *
    `;
    
    const result = await sequelize.query(query, {
      replacements: {
        ticketNumber,
        title,
        description,
        priority: priority || 'medium',
        categoryId: categoryId || null,
        userId,
        initiatorId: userId,
        slaDeadline
      },
      type: QueryTypes.INSERT
    });

    const ticket = result[0][0];
    
    console.log('✅ Заявка создана:', ticket);
    console.log('⏰ SLA deadline:', slaDeadline);

    res.status(201).json({
      message: 'Заявка успешно создана',
      ticket: ticket
    });
  } catch (error) {
    console.error('❌ Ошибка создания заявки:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Ошибка создания заявки',
      error: error.message 
    });
  }
};

// Обновление заявки
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('🔄 Обновление заявки:', { id, updates });

    const existing = await sequelize.query(
      'SELECT * FROM tickets WHERE id = :id',
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const allowedFields = [
      'title', 'description', 'status', 'priority', 
      'categoryId', 'assignedTo', 'resolution'
    ];
    
    const updateFields = [];
    const replacements = { id };

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`"${key}" = :${key}`);
        replacements[key] = updates[key];
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Нет полей для обновления' });
    }

    // Если статус меняется на resolved/closed, устанавливаем resolvedAt
    if (updates.status && (updates.status === 'resolved' || updates.status === 'closed')) {
      updateFields.push('"resolvedAt" = NOW()');
    }

    updateFields.push('"updatedAt" = NOW()');

    const query = `UPDATE tickets SET ${updateFields.join(', ')} WHERE id = :id RETURNING *`;

    console.log('📊 SQL запрос обновления:', query);
    console.log('📊 Параметры:', replacements);

    const result = await sequelize.query(query, {
      replacements,
      type: QueryTypes.UPDATE
    });

    console.log('✅ Заявка обновлена:', result[0][0]);

    res.json({
      message: 'Заявка успешно обновлена',
      ticket: result[0][0]
    });
  } catch (error) {
    console.error('❌ Ошибка обновления заявки:', error);
    res.status(500).json({ 
      message: 'Ошибка обновления заявки',
      error: error.message 
    });
  }
};

// Удаление заявки
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Недостаточно прав для удаления заявки' 
      });
    }

    const existing = await sequelize.query(
      'SELECT * FROM tickets WHERE id = :id',
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    await sequelize.query('DELETE FROM tickets WHERE id = :id', {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    res.json({ message: 'Заявка успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    res.status(500).json({ 
      message: 'Ошибка удаления заявки',
      error: error.message 
    });
  }
};

module.exports = {
  getTickets: exports.getTickets,
  getTicketById: exports.getTicketById,
  createTicket: exports.createTicket,
  updateTicket: exports.updateTicket,
  deleteTicket: exports.deleteTicket
};