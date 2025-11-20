import api from './api';

const statsService = {
  // Общая статистика
  getOverallStats: async () => {
    const response = await api.get('/stats/overall');
    return response.data;
  },

  // Статистика по дням
  getTicketsByDate: async () => {
    const response = await api.get('/stats/tickets-by-date');
    return response.data;
  },

  // Топ исполнители
  getTopPerformers: async () => {
    const response = await api.get('/stats/top-performers');
    return response.data;
  },

  // SLA метрики
  getSLAMetrics: async () => {
    const response = await api.get('/stats/sla-metrics');
    return response.data;
  }
};

export default statsService;