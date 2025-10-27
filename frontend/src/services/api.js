import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    // Convert MongoDB _id to id for frontend consistency
    if (response.data && Array.isArray(response.data.tasks)) {
      response.data.tasks = response.data.tasks.map(task => ({
        ...task,
        id: task._id || task.id
      }));
    }
    if (response.data && Array.isArray(response.data.logs)) {
      response.data.logs = response.data.logs.map(log => ({
        ...log,
        id: log._id || log.id
      }));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const logAPI = {
  getLogs: (params) => api.get('/logs', { params })
};

export default api;