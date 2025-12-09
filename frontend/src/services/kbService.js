import axios from 'axios';

const API_URL = 'http://localhost:5000/api/kb';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const kbService = {
  // Получить все статьи
  getArticles: async (params = {}) => {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  },

  // Получить одну статью
  getArticleById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Создать статью
  createArticle: async (articleData) => {
    const response = await axios.post(API_URL, articleData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Обновить статью
  updateArticle: async (id, articleData) => {
    const response = await axios.put(`${API_URL}/${id}`, articleData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Удалить статью
  deleteArticle: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Оценить статью
  rateArticle: async (id, helpful) => {
    const response = await axios.post(`${API_URL}/${id}/rate`, 
      { helpful },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Получить популярные статьи
  getPopularArticles: async (limit = 5) => {
    const response = await axios.get(`${API_URL}/popular`, {
      headers: getAuthHeader(),
      params: { limit }
    });
    return response.data;
  }
};

export default kbService;