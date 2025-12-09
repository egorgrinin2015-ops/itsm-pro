import api from './api';

const userService = {
  // Получение списка инженеров
  getEngineers: async () => {
    const response = await api.get('/users/engineers');
    return response.data;
  }
};

export default userService;