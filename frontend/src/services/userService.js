import api from './api';

const userService = {
  // Получение списка инженеров
  getEngineers: async () => {
    const response = await api.get('/users/engineers');
    return response.data;
  },

  // Получение всех пользователей с фильтрами
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Получение пользователя по ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Создание пользователя
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Обновление пользователя
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Блокировка/разблокировка пользователя
  toggleUserStatus: async (id) => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  // Удаление пользователя
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Сброс пароля
  resetPassword: async (id, newPassword) => {
    const response = await api.patch(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  }
};

export default userService;