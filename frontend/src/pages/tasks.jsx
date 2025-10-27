import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { taskAPI } from '../services/api';
import TaskTable from '../components/TaskTable';
import TaskForm from '../components/TaskForm';
import { TaskIcon,PlusIcon, SearchIcon } from '../components/Icon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0
  });

  const fetchTasks = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks({ 
        page, 
        limit: pagination.limit, 
        search 
      });
      setTasks(response.data.tasks || []);
      setPagination(response.data.pagination || {});
      
      // Calculate stats
      setStats({
        total: response.data.pagination?.total || 0,
        completed: Math.floor(Math.random() * response.data.pagination?.total || 0), // Mock data
        pending: Math.floor(Math.random() * response.data.pagination?.total || 0)   // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchTasks(pagination.page, searchTerm);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, formData);
      } else {
        await taskAPI.createTask(formData);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks(pagination.page, searchTerm);
    } catch (error) {
      console.error('Failed to save task:', error);
      if (error.response?.data?.errors) {
        alert(error.response.data.errors.join(', '));
      } else {
        alert('Failed to save task');
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchTasks(1, value);
    }, 300);
  };

  return (
    <div>
      {/* Modern Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-title">
            <h1>Task Manager</h1>
            <p>Streamline your workflow with intelligent task management</p>
          </div>
          <motion.button
            className="btn btn-primary"
            onClick={handleCreate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon />
            New Task
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3>Total Tasks</h3>
              <div className="stat-value">
                {loading ? <Skeleton width={60} /> : stats.total}
              </div>
            </div>
            <div className="stat-icon">
              <TaskIcon />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3>Completed</h3>
              <div className="stat-value">
                {loading ? <Skeleton width={60} /> : stats.completed}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              ✓
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3>Pending</h3>
              <div className="stat-value">
                {loading ? <Skeleton width={60} /> : stats.pending}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              !
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <motion.div 
        className="action-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            Filter
          </button>
          <button className="btn btn-secondary">
            Sort
          </button>
        </div>
      </motion.div>

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />

      {/* Pagination */}
      {tasks.length > 0 && (
        <motion.div 
          className="pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="pagination-info">
            Showing {tasks.length} of {pagination.total} tasks
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.page === 1}
              onClick={() => fetchTasks(pagination.page - 1, searchTerm)}
            >
              Previous
            </button>
            <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchTasks(pagination.page + 1, searchTerm)}
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          isEditing={!!editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;