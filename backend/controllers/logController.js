import AuditLogModel from '../models/AuditLog.js';

export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await AuditLogModel.findAll({ 
      page: parseInt(page), 
      limit: parseInt(limit) 
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch audit logs', 
      details: error.message 
    });
  }
};