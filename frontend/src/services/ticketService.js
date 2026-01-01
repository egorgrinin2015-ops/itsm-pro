import api from './api';

const ticketService = {
  // Получить все заявки с фильтрами
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.search) params.append('search', filters.search);
    if (filters.myTickets) params.append('myTickets', filters.myTickets);
    
    // НОВОЕ: Поддержка фильтра закрытых заявок
    if (filters.showClosed) params.append('showClosed', filters.showClosed);
    if (filters.onlyClosed) params.append('onlyClosed', filters.onlyClosed);

    const response = await api.get(`/tickets?${params.toString()}`);
    return response.data;
  },

  // Получить заявку по ID
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Создать новую заявку
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Обновить статус заявки
  updateTicketStatus: async (id, status) => {
    const response = await api.patch(`/tickets/${id}/status`, { status });
    return response.data;
  },

  // Назначить исполнителя
  assignTicket: async (id, engineerId) => {
    const response = await api.patch(`/tickets/${id}/assign`, { engineerId });
    return response.data;
  },

  // Обновить заявку
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Удалить заявку
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // Получить статистику
  getTicketStats: async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
  }
};

export default ticketService;