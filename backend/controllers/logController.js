import { dbAll } from '../database/init.js';

export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const logs = await dbAll(
      `SELECT * FROM audit_logs 
       ORDER BY timestamp DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const totalResult = await dbAll('SELECT COUNT(*) as total FROM audit_logs');
    const total = totalResult[0].total;
    
    // Parse updatedContent from JSON string
    const parsedLogs = logs.map(log => ({
      ...log,
      updatedContent: log.updatedContent ? JSON.parse(log.updatedContent) : null
    }));
    
    res.json({
      logs: parsedLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};