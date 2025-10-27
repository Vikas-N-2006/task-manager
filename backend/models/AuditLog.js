import { getCollection, toObjectId } from '../database/mongodb.js';

const AuditLogModel = {
  collection: () => getCollection('audit_logs'),

  // Create audit log entry
  async create(logData) {
    const log = {
      ...logData,
      timestamp: new Date().toISOString()
    };

    const result = await this.collection().insertOne(log);
    return { _id: result.insertedId, ...log };
  },

  // Get all audit logs with pagination
  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.collection()
        .find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      this.collection().countDocuments()
    ]);

    return {
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Get logs for a specific task
  async findByTaskId(taskId) {
    return await this.collection()
      .find({ taskId })
      .sort({ timestamp: -1 })
      .toArray();
  }
};

export default AuditLogModel;