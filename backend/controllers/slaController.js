const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Получить статистику SLA
exports.getSlaStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    const replacements = {};

    if (startDate && endDate) {
      dateFilter = ` AND t."createdAt" BETWEEN :startDate AND :endDate`;
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else {
      // По умолчанию - последние 30 дней
      dateFilter = ` AND t."createdAt" >= NOW() - INTERVAL '30 days'`;
    }

    // Общая статистика SLA
    const overallStats = await sequelize.query(`
      SELECT 
        COUNT(*) as "totalTickets",
        COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" <= t."slaDeadline" THEN 1 END) as "metSla",
        COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" > t."slaDeadline" THEN 1 END) as "breachedSla",
        COUNT(CASE WHEN t."resolvedAt" IS NULL AND NOW() > t."slaDeadline" THEN 1 END) as "breachedActive",
        COUNT(CASE WHEN t."resolvedAt" IS NULL AND NOW() <= t."slaDeadline" THEN 1 END) as "activeWithinSla",
        ROUND(
          (COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" <= t."slaDeadline" THEN 1 END)::numeric / 
          NULLIF(COUNT(CASE WHEN t."resolvedAt" IS NOT NULL THEN 1 END), 0)) * 100, 2
        ) as "slaCompliancePercent"
      FROM tickets t
      WHERE 1=1 ${dateFilter}
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Статистика по категориям
    const categoryStats = await sequelize.query(`
      SELECT 
        c.name as "categoryName",
        c."slaTime" as "slaMinutes",
        COUNT(*) as "totalTickets",
        COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" <= t."slaDeadline" THEN 1 END) as "metSla",
        COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" > t."slaDeadline" THEN 1 END) as "breachedSla",
        ROUND(
          (COUNT(CASE WHEN t."resolvedAt" IS NOT NULL AND t."resolvedAt" <= t."slaDeadline" THEN 1 END)::numeric / 
          NULLIF(COUNT(CASE WHEN t."resolvedAt" IS NOT NULL THEN 1 END), 0)) * 100, 2
        ) as "compliancePercent"
      FROM tickets t
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      WHERE 1=1 ${dateFilter}
      GROUP BY c.id, c.name, c."slaTime"
      ORDER BY "totalTickets" DESC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Заявки с нарушением SLA (активные)
    const breachedTickets = await sequelize.query(`
      SELECT 
        t.id,
        t."ticketNumber",
        t.title,
        t.priority,
        t."slaDeadline",
        t."createdAt",
        c.name as "categoryName",
        u."fullName" as "assignedToName",
        EXTRACT(EPOCH FROM (NOW() - t."slaDeadline")) / 3600 as "hoursOverdue"
      FROM tickets t
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      LEFT JOIN users u ON t."assignedTo" = u.id
      WHERE t."resolvedAt" IS NULL 
        AND NOW() > t."slaDeadline"
        ${dateFilter}
      ORDER BY t."slaDeadline" ASC
      LIMIT 20
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Заявки близкие к дедлайну (в течение 1 часа)
    const nearDeadline = await sequelize.query(`
      SELECT 
        t.id,
        t."ticketNumber",
        t.title,
        t.priority,
        t."slaDeadline",
        c.name as "categoryName",
        u."fullName" as "assignedToName",
        EXTRACT(EPOCH FROM (t."slaDeadline" - NOW())) / 60 as "minutesRemaining"
      FROM tickets t
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      LEFT JOIN users u ON t."assignedTo" = u.id
      WHERE t."resolvedAt" IS NULL 
        AND t."slaDeadline" > NOW()
        AND t."slaDeadline" <= NOW() + INTERVAL '1 hour'
      ORDER BY t."slaDeadline" ASC
      LIMIT 10
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      overall: overallStats[0],
      byCategory: categoryStats,
      breached: breachedTickets,
      nearDeadline: nearDeadline
    });
  } catch (error) {
    console.error('Ошибка получения статистики SLA:', error);
    res.status(500).json({ 
      message: 'Ошибка получения статистики SLA',
      error: error.message 
    });
  }
};

// Проверить нарушения SLA (для cron job)
exports.checkSlaBreaches = async (req, res) => {
  try {
    // Находим заявки с нарушенным SLA
    const breached = await sequelize.query(`
      SELECT 
        t.id,
        t."ticketNumber",
        t.title,
        t."assignedTo",
        t."userId" as "creatorId",
        t."slaDeadline",
        EXTRACT(EPOCH FROM (NOW() - t."slaDeadline")) / 3600 as "hoursOverdue"
      FROM tickets t
      WHERE t."resolvedAt" IS NULL 
        AND NOW() > t."slaDeadline"
        AND t.status != 'resolved'
        AND t.status != 'closed'
    `, {
      type: QueryTypes.SELECT
    });

    // Находим заявки близкие к нарушению (30 минут)
    const nearBreach = await sequelize.query(`
      SELECT 
        t.id,
        t."ticketNumber",
        t.title,
        t."assignedTo",
        t."slaDeadline",
        EXTRACT(EPOCH FROM (t."slaDeadline" - NOW())) / 60 as "minutesRemaining"
      FROM tickets t
      WHERE t."resolvedAt" IS NULL 
        AND t."slaDeadline" > NOW()
        AND t."slaDeadline" <= NOW() + INTERVAL '30 minutes'
        AND t.status != 'resolved'
        AND t.status != 'closed'
    `, {
      type: QueryTypes.SELECT
    });

    res.json({
      breached: breached,
      nearBreach: nearBreach,
      breachedCount: breached.length,
      nearBreachCount: nearBreach.length
    });
  } catch (error) {
    console.error('Ошибка проверки нарушений SLA:', error);
    res.status(500).json({ 
      message: 'Ошибка проверки нарушений SLA',
      error: error.message 
    });
  }
};

// Получить статус SLA для конкретной заявки
exports.getTicketSlaStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await sequelize.query(`
      SELECT 
        t.id,
        t."ticketNumber",
        t."slaDeadline",
        t."createdAt",
        t."resolvedAt",
        t.status,
        c."slaTime" as "slaMinutes",
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
          WHEN t."resolvedAt" IS NOT NULL THEN
            EXTRACT(EPOCH FROM (t."resolvedAt" - t."createdAt")) / 60
          ELSE
            EXTRACT(EPOCH FROM (NOW() - t."createdAt")) / 60
        END as "elapsedMinutes",
        CASE 
          WHEN t."resolvedAt" IS NULL THEN
            EXTRACT(EPOCH FROM (t."slaDeadline" - NOW())) / 60
          ELSE
            EXTRACT(EPOCH FROM (t."slaDeadline" - t."resolvedAt")) / 60
        END as "remainingMinutes"
      FROM tickets t
      LEFT JOIN service_categories c ON t."categoryId" = c.id
      WHERE t.id = :id
    `, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (ticket.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    res.json(ticket[0]);
  } catch (error) {
    console.error('Ошибка получения статуса SLA:', error);
    res.status(500).json({ 
      message: 'Ошибка получения статуса SLA',
      error: error.message 
    });
  }
};

module.exports = {
  getSlaStats: exports.getSlaStats,
  checkSlaBreaches: exports.checkSlaBreaches,
  getTicketSlaStatus: exports.getTicketSlaStatus
};