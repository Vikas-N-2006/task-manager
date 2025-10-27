import { motion } from 'framer-motion';
import { EditIcon, DeleteIcon } from './Icon';

const TaskTable = ({ tasks, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="skeleton-container" style={{ padding: '2rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" style={{ marginBottom: '1rem' }}>
              <div className="skeleton-cell loading-shimmer" style={{ width: '60px', height: '20px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '200px', height: '20px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '300px', height: '20px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '120px', height: '20px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '100px', height: '20px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state" style={{ padding: '3rem 2rem' }}>
          <div className="empty-state-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Get started by creating your first task</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="table-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <table className="table">
        <thead>
          <tr>
            <th className="table-header-enhanced">ID</th>
            <th className="table-header-enhanced">Title</th>
            <th className="table-header-enhanced">Description</th>
            <th className="table-header-enhanced">Created At</th>
            <th className="table-header-enhanced">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <motion.tr 
              key={task.id}
              className="audit-log-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td style={{ color: 'var(--gray-400)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                #{task.id || task._id}
              </td>
              <td style={{ color: 'var(--gray-300)', fontWeight: '500' }}>
                {task.title}
              </td>
              <td style={{ color: 'var(--gray-400)', maxWidth: '300px' }}>
                <div style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {task.description}
                </div>
              </td>
              <td style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
              <td>
                <div className="action-buttons">
                  <motion.button
                    className="btn-modern warning btn-sm"
                    onClick={() => onEdit(task)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <EditIcon size={14} />
                    Edit
                  </motion.button>
                  <motion.button
                    className="btn-modern error btn-sm"
                    onClick={() => onDelete(task.id || task._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <DeleteIcon size={14} />
                    Delete
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TaskTable;