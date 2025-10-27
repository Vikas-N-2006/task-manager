import { getCollection, toObjectId } from '../database/mongodb.js';

const TaskModel = {
  collection: () => getCollection('tasks'),

  // Get all tasks with pagination and search
  async findAll({ page = 1, limit = 5, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const query = {};
    
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      this.collection()
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      this.collection().countDocuments(query)
    ]);

    return {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Find task by ID
  async findById(id) {
    return await this.collection().findOne({ _id: toObjectId(id) });
  },

  // Create new task
  async create(taskData) {
    const task = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await this.collection().insertOne(task);
    return { _id: result.insertedId, ...task };
  },

  // Update task
  async update(id, updateData) {
    const updateDoc = {
      $set: {
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    };

    const result = await this.collection().findOneAndUpdate(
      { _id: toObjectId(id) },
      updateDoc,
      { returnDocument: 'after' }
    );

    return result;
  },

  // Delete task
  async delete(id) {
    const result = await this.collection().findOneAndDelete({ 
      _id: toObjectId(id) 
    });
    return result;
  }
};

export default TaskModel;