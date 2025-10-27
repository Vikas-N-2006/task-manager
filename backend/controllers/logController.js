import AuditLogModel from '../models/AuditLog.js';

export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, action, search, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;

    // Build query filters
    const filters = {};
    if (action && action !== '') {
      filters.action = action;
    }
    
    // Search functionality
    if (search && search.trim() !== '') {
      filters.$or = [
        { action: { $regex: search, $options: 'i' } },
        { 'updatedContent.title': { $regex: search, $options: 'i' } },
        { 'updatedContent.description': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const result = await AuditLogModel.findAll({ 
      page: parseInt(page), 
      limit: parseInt(limit),
      filters,
      sort
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(' Failed to fetch audit logs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch audit logs', 
      details: error.message 
    });
  }
};