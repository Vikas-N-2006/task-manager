import { useState, useEffect } from 'react';
import { logAPI } from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await logAPI.getLogs({ page, limit: pagination.limit });
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionClass = (action) => {
    switch (action) {
      case 'Create Task':
        return 'log-create';
      case 'Update Task':
        return 'log-update';
      case 'Delete Task':
        return 'log-delete';
      default:
        return '';
    }
  };

  const renderUpdatedContent = (content) => {
    if (!content) return '-';
    
    return Object.entries(content).map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {value}
      </div>
    ));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading audit logs...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Audit Logs</h1>
        <p>Track all task management activities</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Task ID</th>
              <th>Updated Content</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>
                  <span className={getActionClass(log.action)}>
                    {log.action}
                  </span>
                </td>
                <td>{log.taskId}</td>
                <td>{renderUpdatedContent(log.updatedContent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {logs.length} of {pagination.total} logs
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary"
              disabled={pagination.page === 1}
              onClick={() => fetchLogs(pagination.page - 1)}
            >
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.pages}</span>
            <button
              className="btn btn-secondary"
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchLogs(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;