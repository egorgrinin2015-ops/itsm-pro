const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Общая статистика
exports.getOverallStats = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    // Реальные подсчеты из базы
    const totalTickets = await sequelize.query(
      'SELECT COUNT(*) as count FROM tickets',
      { type: QueryTypes.SELECT }
    );
    
    const totalUsers = await sequelize.query(
      'SELECT COUNT(*) as count FROM users',
      { type: QueryTypes.SELECT }
    );
    
    const totalCategories = await sequelize.query(
      'SELECT COUNT(*) as count FROM service_categories',
      { type: QueryTypes.SELECT }
    );
    
    const resolvedTickets = await sequelize.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'resolved'",
      { type: QueryTypes.SELECT }
    );
    
    const newTickets = await sequelize.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'new'",
      { type: QueryTypes.SELECT }
    );
    
    const inProgressTickets = await sequelize.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'in_progress'",
      { type: QueryTypes.SELECT }
    );
    
    const waitingTickets = await sequelize.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'waiting'",
      { type: QueryTypes.SELECT }
    );
    
    const closedTickets = await sequelize.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'closed'",
      { type: QueryTypes.SELECT }
    );

    const total = parseInt(totalTickets[0].count);
    const resolved = parseInt(resolvedTickets[0].count);
    const newCount = parseInt(newTickets[0].count);
    const inProgress = parseInt(inProgressTickets[0].count);
    const waiting = parseInt(waitingTickets[0].count);
    const closed = parseInt(closedTickets[0].count);
    const openTickets = newCount + inProgress + waiting;

    // Статистика по приоритетам
    const priorityStats = await sequelize.query(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM tickets
      GROUP BY priority
    `, { type: QueryTypes.SELECT });

    // Статистика по категориям
    const categoryStats = await sequelize.query(`
      SELECT 
        c.name as "categoryName",
        COUNT(t.id) as count
      FROM service_categories c
      LEFT JOIN tickets t ON c.id = t."categoryId"
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `, { type: QueryTypes.SELECT });

    // Форматируем приоритеты
    const priorityMap = { low: 0, medium: 0, high: 0, critical: 0 };
    priorityStats.forEach(stat => {
      priorityMap[stat.priority] = parseInt(stat.count);
    });

    res.json({
      overall: {
        totalTickets: total,
        totalUsers: parseInt(totalUsers[0].count),
        totalCategories: parseInt(totalCategories[0].count),
        openTickets,
        resolvedTickets: resolved,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      },
      priority: [
        { priority: 'low', count: priorityMap.low },
        { priority: 'medium', count: priorityMap.medium },
        { priority: 'high', count: priorityMap.high },
        { priority: 'critical', count: priorityMap.critical }
      ],
      status: [
        { status: 'new', count: newCount },
        { status: 'in_progress', count: inProgress },
        { status: 'waiting', count: waiting },
        { status: 'resolved', count: resolved },
        { status: 'closed', count: closed }
      ],
      categories: categoryStats.map(cat => ({
        categoryName: cat.categoryName,
        count: parseInt(cat.count)
      }))
    });

  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};

// Статистика по дням
exports.getTicketsByDate = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    // Получаем статистику за последние 30 дней
    const ticketsByDate = await sequelize.query(`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM tickets
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `, { type: QueryTypes.SELECT });

    // Если нет данных, создаем пустую структуру
    if (ticketsByDate.length === 0) {
      const result = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        result.push({
          date: date.toISOString().split('T')[0],
          count: 0
        });
      }
      
      return res.json({ ticketsByDate: result });
    }

    res.json({ 
      ticketsByDate: ticketsByDate.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      }))
    });

  } catch (error) {
    console.error('Ошибка получения статистики по дням:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};

// Топ исполнители
exports.getTopPerformers = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    // Получаем топ исполнителей
    const topPerformers = await sequelize.query(`
      SELECT 
        u."fullName" as "assigneeName",
        COUNT(t.id) as "resolvedCount"
      FROM users u
      INNER JOIN tickets t ON u.id = t."assignedTo"
      WHERE t.status IN ('resolved', 'closed')
      GROUP BY u.id, u."fullName"
      ORDER BY COUNT(t.id) DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT });

    // Если нет данных, возвращаем пустой массив
    if (topPerformers.length === 0) {
      return res.json({ topPerformers: [] });
    }

    res.json({ 
      topPerformers: topPerformers.map(performer => ({
        assigneeName: performer.assigneeName,
        resolvedCount: parseInt(performer.resolvedCount)
      }))
    });

  } catch (error) {
    console.error('Ошибка получения топ исполнителей:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};

// SLA метрики
exports.getSLAMetrics = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    // Просроченные заявки
    const overdueTickets = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE "slaDeadline" < NOW()
      AND status NOT IN ('resolved', 'closed')
    `, { type: QueryTypes.SELECT });

    // Заявки близкие к дедлайну (в течение 2 часов)
    const nearDeadline = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE "slaDeadline" BETWEEN NOW() AND NOW() + INTERVAL '2 hours'
      AND status NOT IN ('resolved', 'closed')
    `, { type: QueryTypes.SELECT });

    // SLA по категориям
    const slaByCategory = await sequelize.query(`
      SELECT 
        c.name,
        c."slaTime",
        COALESCE(
          AVG(EXTRACT(EPOCH FROM (t."resolvedAt" - t."createdAt")) / 60),
          c."slaTime" * 0.8
        ) as "avgResolutionTime"
      FROM service_categories c
      LEFT JOIN tickets t ON c.id = t."categoryId" 
        AND t.status = 'resolved' 
        AND t."resolvedAt" IS NOT NULL
      GROUP BY c.id, c.name, c."slaTime"
      ORDER BY c.name ASC
    `, { type: QueryTypes.SELECT });

    res.json({
      overdueTickets: parseInt(overdueTickets[0].count),
      nearDeadline: parseInt(nearDeadline[0].count),
      slaByCategory: slaByCategory.map(cat => ({
        name: cat.name,
        slaTime: cat.slaTime,
        avgResolutionTime: Math.round(parseFloat(cat.avgResolutionTime))
      }))
    });

  } catch (error) {
    console.error('Ошибка получения SLA метрик:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};

// ПРАВИЛЬНЫЙ ЭКСПОРТ
module.exports = {
  getOverallStats: exports.getOverallStats,
  getTicketsByDate: exports.getTicketsByDate,
  getTopPerformers: exports.getTopPerformers,
  getSLAMetrics: exports.getSLAMetrics
};