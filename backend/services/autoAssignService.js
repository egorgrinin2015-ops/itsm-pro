// Утилита для автоназначения заявок на инженеров
// Алгоритм: Least Loaded (минимальная загрузка)

const { User, Ticket } = require('../models');
const { Op } = require('sequelize');

/**
 * Получить всех доступных инженеров
 */
const getAvailableEngineers = async () => {
  try {
    const engineers = await User.findAll({
      where: {
        role: {
          [Op.in]: ['engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5']
        }
      },
      attributes: ['id', 'fullName', 'email', 'role']
    });

    return engineers;
  } catch (error) {
    console.error('Ошибка получения инженеров:', error);
    throw error;
  }
};

/**
 * Подсчитать количество активных заявок у инженера
 */
const countActiveTickets = async (engineerId) => {
  try {
    const count = await Ticket.count({
      where: {
        assignedTo: engineerId,
        status: {
          [Op.in]: ['new', 'in_progress', 'on_hold']
        }
      }
    });

    return count;
  } catch (error) {
    console.error(`Ошибка подсчёта заявок для инженера ${engineerId}:`, error);
    throw error;
  }
};

/**
 * Найти инженера с минимальной загрузкой
 */
const findLeastLoadedEngineer = async () => {
  try {
    // Получаем всех инженеров
    const engineers = await getAvailableEngineers();

    if (engineers.length === 0) {
      console.log('Нет доступных инженеров для автоназначения');
      return null;
    }

    // Подсчитываем нагрузку для каждого
    const engineersWithLoad = await Promise.all(
      engineers.map(async (engineer) => {
        const activeTickets = await countActiveTickets(engineer.id);
        return {
          id: engineer.id,
          fullName: engineer.fullName,
          email: engineer.email,
          role: engineer.role,
          activeTickets
        };
      })
    );

    // Сортируем по количеству активных заявок (по возрастанию)
    engineersWithLoad.sort((a, b) => a.activeTickets - b.activeTickets);

    // Находим минимальное количество заявок
    const minLoad = engineersWithLoad[0].activeTickets;

    // Находим всех инженеров с минимальной загрузкой
    const leastLoadedEngineers = engineersWithLoad.filter(
      e => e.activeTickets === minLoad
    );

    // Если несколько с одинаковой загрузкой - выбираем случайного
    const selectedEngineer = leastLoadedEngineers[
      Math.floor(Math.random() * leastLoadedEngineers.length)
    ];

    console.log(`Выбран инженер: ${selectedEngineer.fullName} (${selectedEngineer.activeTickets} активных заявок)`);

    return selectedEngineer;
  } catch (error) {
    console.error('Ошибка поиска инженера:', error);
    throw error;
  }
};

/**
 * Автоматически назначить заявку на инженера
 */
const autoAssignTicket = async (ticketId) => {
  try {
    // Находим заявку
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error(`Заявка с ID ${ticketId} не найдена`);
    }

    // Если заявка уже назначена - пропускаем
    if (ticket.assignedTo) {
      console.log(`Заявка ${ticketId} уже назначена на инженера ${ticket.assignedTo}`);
      return {
        success: false,
        message: 'Заявка уже назначена',
        assignedTo: ticket.assignedTo
      };
    }

    // Находим инженера с минимальной загрузкой
    const engineer = await findLeastLoadedEngineer();

    if (!engineer) {
      console.log(`Нет доступных инженеров для автоназначения заявки ${ticketId}`);
      return {
        success: false,
        message: 'Нет доступных инженеров'
      };
    }

    // Назначаем заявку
    ticket.assignedTo = engineer.id;
    await ticket.save();

    console.log(`✅ Заявка ${ticketId} автоматически назначена на ${engineer.fullName} (ID: ${engineer.id})`);

    return {
      success: true,
      message: 'Заявка автоматически назначена',
      assignedTo: engineer.id,
      engineerName: engineer.fullName,
      engineerLoad: engineer.activeTickets
    };
  } catch (error) {
    console.error('Ошибка автоназначения:', error);
    throw error;
  }
};

/**
 * Получить статистику загруженности инженеров
 */
const getEngineersLoadStats = async () => {
  try {
    const engineers = await getAvailableEngineers();

    const stats = await Promise.all(
      engineers.map(async (engineer) => {
        const activeTickets = await countActiveTickets(engineer.id);
        
        // Подсчитываем по статусам
        const newTickets = await Ticket.count({
          where: { assignedTo: engineer.id, status: 'new' }
        });
        
        const inProgressTickets = await Ticket.count({
          where: { assignedTo: engineer.id, status: 'in_progress' }
        });
        
        const onHoldTickets = await Ticket.count({
          where: { assignedTo: engineer.id, status: 'on_hold' }
        });

        return {
          id: engineer.id,
          fullName: engineer.fullName,
          email: engineer.email,
          role: engineer.role,
          totalActive: activeTickets,
          new: newTickets,
          inProgress: inProgressTickets,
          onHold: onHoldTickets
        };
      })
    );

    return stats;
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
};

module.exports = {
  getAvailableEngineers,
  countActiveTickets,
  findLeastLoadedEngineer,
  autoAssignTicket,
  getEngineersLoadStats
};