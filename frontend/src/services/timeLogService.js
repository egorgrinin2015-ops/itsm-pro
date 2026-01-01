const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Получить заголовки авторизации
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Добавить запись времени к заявке
const addTimeLog = async (ticketId, data) => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/time-logs`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add time log');
  }
  return response.json();
};

// Получить все записи времени по заявке
const getTicketTimeLogs = async (ticketId) => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/time-logs`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get time logs');
  }
  return response.json();
};

// Получить свои записи времени
const getMyTimeLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/time-logs/my?${queryString}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get my time logs');
  }
  return response.json();
};

// Получить статистику по времени (для менеджеров/админов)
const getTimeStats = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/time-logs/stats?${queryString}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get time stats');
  }
  return response.json();
};

// Обновить запись времени
const updateTimeLog = async (id, data) => {
  const response = await fetch(`${API_URL}/time-logs/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update time log');
  }
  return response.json();
};

// Удалить запись времени
const deleteTimeLog = async (id) => {
  const response = await fetch(`${API_URL}/time-logs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete time log');
  }
  return response.json();
};

// Export individual functions
export {
  addTimeLog,
  getTicketTimeLogs,
  getMyTimeLogs,
  getTimeStats,
  updateTimeLog,
  deleteTimeLog
};

// Default export object
const timeLogService = {
  addTimeLog,
  getTicketTimeLogs,
  getMyTimeLogs,
  getTimeStats,
  updateTimeLog,
  deleteTimeLog
};

export default timeLogService;