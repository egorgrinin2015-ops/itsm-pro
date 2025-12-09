import api from './api';

const ticketService = {
  // Получение всех заявок с фильтрами
  getTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  // Получение одной заявки
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Создание заявки
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Обновление заявки
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Удаление заявки
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // НОВОЕ: Изменение статуса заявки
  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  // НОВОЕ: Назначение ответственного исполнителя
  assignTicket: async (ticketId, engineerId) => {
    const response = await api.put(`/tickets/${ticketId}/assign`, { engineerId });
    return response.data;
  }
};

export default ticketService;