import api from './api';

const commentService = {
  // Получение комментариев заявки
  getComments: async (ticketId) => {
    const response = await api.get(`/comments/ticket/${ticketId}`);
    return response.data;
  },

  // Добавление комментария
  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/comments/ticket/${ticketId}`, commentData);
    return response.data;
  },

  // Удаление комментария
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

export default commentService;