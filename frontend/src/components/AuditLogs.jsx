import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logAPI } from '../services/api';
import { SearchIcon, FilterIcon, SortAscIcon, SortDescIcon } from './Icon';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Filter and sort states
  const [filters, setFilters] = useState({
    action: '',
    search: ''
  });
  const [sort, setSort] = useState({
    field: 'timestamp',
    direction: 'desc'
  });

  const fetchLogs = async (page = 1, currentFilters = filters, currentSort = sort) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...currentFilters,
        sortBy: currentSort.field,
        sortOrder: currentSort.direction
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await logAPI.getLogs(params);
      if (response.data.success) {
        setLogs(response.data.data.logs || []);
        setPagination(response.data.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, filters, sort);
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    fetchLogs(1, newFilters, sort);
  };

  const handleSortChange = (field) => {
    const newSort = {
      field,
      direction: sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc'
    };
    setSort(newSort);
    fetchLogs(pagination.page, filters, newSort);
  };

  const handlePageChange = (newPage) => {
    fetchLogs(newPage, filters, sort);
  };

  const clearFilters = () => {
    const newFilters = { action: '', search: '' };
    const newSort = { field: 'timestamp', direction: 'desc' };
    setFilters(newFilters);
    setSort(newSort);
    fetchLogs(1, newFilters, newSort);
  };

  const getActionClass = (action) => {
    switch (action) {
      case 'Create Task':
        return 'action-create';
      case 'Update Task':
        return 'action-update';
      case 'Delete Task':
        return 'action-delete';
      default:
        return '';
    }
  };

  const renderUpdatedContent = (content) => {
    if (!content || Object.keys(content).length === 0) {
      return <span style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>No changes</span>;
    }
    
    return (
      <div className="updated-content">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="content-item">
            <span className="content-key">{key}:</span>
            <span className="content-value">{value || <em>Empty</em>}</span>
          </div>
        ))}
      </div>
    );
  };

  const SortButton = ({ field, children }) => (
    <button
      className="btn-modern ghost btn-sm"
      onClick={() => handleSortChange(field)}
      style={{ 
        opacity: sort.field === field ? 1 : 0.7,
        background: sort.field === field ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
      }}
    >
      {children}
      {sort.field === field && (
        sort.direction === 'desc' ? <SortDescIcon size={14} /> : <SortAscIcon size={14} />
      )}
    </button>
  );

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  if (loading && logs.length === 0) {
    return (
      <div>
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Audit Logs</h1>
              <p>Track all task management activities</p>
            </div>
          </div>
        </div>
        
        <div className="skeleton-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell loading-shimmer" style={{ width: '150px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '120px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '80px' }}></div>
              <div className="skeleton-cell loading-shimmer" style={{ width: '200px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Enhanced Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <div className="header-title">
            <h1>Audit Logs</h1>
            <p>Track all task management activities with detailed change history</p>
          </div>
          
          {(filters.action || filters.search) && (
            <button 
              className="btn-modern ghost"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Enhanced Filter and Sort Controls */}
      <motion.div 
        className="action-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="filter-sort-container">
          <div className="filter-group">
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <SearchIcon className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search actions or content..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <select
              className="filter-select"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="Create Task">Create Tasks</option>
              <option value="Update Task">Update Tasks</option>
              <option value="Delete Task">Delete Tasks</option>
            </select>
          </div>
          
          <div className="filter-group">
            <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              Sort by:
            </span>
            <SortButton field="timestamp">
              Date
            </SortButton>
            <SortButton field="action">
              Action
            </SortButton>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Logs Table */}
      <motion.div 
        className="table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="table">
          <thead>
            <tr>
              <th className="table-header-enhanced">Timestamp</th>
              <th className="table-header-enhanced">Action</th>
              <th className="table-header-enhanced">Task ID</th>
              <th className="table-header-enhanced">Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <h3>No audit logs found</h3>
                  <p>
                    {filters.action || filters.search 
                      ? 'No activities match your current filters' 
                      : 'No audit logs have been recorded yet'
                    }
                  </p>
                  {(filters.action || filters.search) && (
                    <button 
                      className="btn-modern primary"
                      onClick={clearFilters}
                      style={{ marginTop: '1rem' }}
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <motion.tr 
                  key={log.id || log._id}
                  className="audit-log-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td style={{ color: 'var(--gray-300)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span className={`action-badge ${getActionClass(log.action)}`}>
                      {log.action.replace(' Task', '')}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gray-400)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    #{log.taskId}
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    {renderUpdatedContent(log.updatedContent)}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Enhanced Pagination with Numbered Pages */}
        {logs.length > 0 && pagination.pages > 1 && (
          <motion.div 
            className="pagination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="pagination-info">
              Showing {logs.length} of {pagination.total} logs
              {(filters.action || filters.search) && ' (filtered)'}
            </div>
            
            <div className="pagination-controls">
              <button
                className="btn-modern ghost btn-sm"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                {generatePageNumbers().map((pageNum, index, array) => {
                  // Add ellipsis for gaps in page numbers
                  const showEllipsis = index > 0 && pageNum - array[index - 1] > 1;
                  
                  return (
                    <div key={pageNum} style={{ display: 'flex', alignItems: 'center' }}>
                      {showEllipsis && (
                        <span style={{ color: 'var(--gray-500)', padding: '0 0.5rem' }}>...</span>
                      )}
                      <button
                        className={`btn-modern ghost btn-sm ${pagination.page === pageNum ? 'primary' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          minWidth: '2.5rem',
                          background: pagination.page === pageNum ? 'var(--primary)' : 'transparent',
                          color: pagination.page === pageNum ? 'white' : 'var(--gray-400)'
                        }}
                      >
                        {pageNum}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <button
                className="btn-modern ghost btn-sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuditLogs;