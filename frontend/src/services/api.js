import axios from 'axios';

// Create axios instance with Basic Auth
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add Basic Auth credentials
const username = 'admin';
const password = 'password123';
const token = btoa(`${username}:${password}`);

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Basic ${token}`;
  return config;
});

// Response interceptor to handle MongoDB _id
api.interceptors.response.use((response) => {
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
});

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