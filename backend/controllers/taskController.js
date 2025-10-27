import TaskModel from '../models/Task.js';
import AuditLogModel from '../models/AuditLog.js';

// Input validation
const validateTask = (title, description) => {
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  return errors;
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Audit log helper
const logAction = async (action, taskId, updatedContent = null) => {
  try {
    await AuditLogModel.create({
      action,
      taskId,
      updatedContent
    });
    console.log(` Audit log created: ${action} for task ${taskId}`);
  } catch (error) {
    console.error(' Failed to create audit log:', error);
  }
};

export const getTasks = async (req, res) => {
  try {
    console.log('📥 Fetching tasks with query:', req.query);
    const { page = 1, limit = 5, search = '' } = req.query;

    const result = await TaskModel.findAll({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      search 
    });

    console.log(` Found ${result.tasks.length} tasks, total: ${result.pagination.total}`);

    res.json(result);
  } catch (error) {
    console.error(' Failed to fetch tasks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks', 
      details: error.message 
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(' Failed to fetch task:', error);
    res.status(500).json({ 
      error: 'Failed to fetch task', 
      details: error.message 
    });
  }
};

export const createTask = async (req, res) => {
  try {
    console.log('📥 Creating task with data:', req.body);
    
    let { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required',
        received: { title, description }
      });
    }
    
    // Sanitize inputs
    title = sanitizeInput(title.toString().trim());
    description = sanitizeInput(description.toString().trim());
    
    // Validate inputs
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    console.log('💾 Inserting task into MongoDB...');
    
    // Create task
    const task = await TaskModel.create({ title, description });
    
    console.log(` Task created with ID: ${task._id}`);
    
    // Log the creation action
    await logAction('Create Task', task._id.toString(), { title, description });
    
    res.status(201).json({ 
      id: task._id,
      title: task.title, 
      description: task.description,
      createdAt: task.createdAt,
      message: 'Task created successfully' 
    });
    
  } catch (error) {
    console.error(' Failed to create task:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    let { title, description } = req.body;
    
    // Sanitize inputs
    title = sanitizeInput(title.toString().trim());
    description = sanitizeInput(description.toString().trim());
    
    // Validate inputs
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Check if task exists and get original
    const originalTask = await TaskModel.findById(taskId);
    if (!originalTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Determine changed fields
    const updatedContent = {};
    if (title !== originalTask.title) updatedContent.title = title;
    if (description !== originalTask.description) updatedContent.description = description;
    
    // Update task
    const updatedTask = await TaskModel.update(taskId, { title, description });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found after update' });
    }
    
    // Log the update action with only changed fields
    await logAction('Update Task', taskId, updatedContent);
    
    res.json({ 
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error(' Failed to update task:', error);
    res.status(500).json({ 
      error: 'Failed to update task', 
      details: error.message 
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = await TaskModel.delete(taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found for deletion' });
    }
    
    // Log the deletion action
    await logAction('Delete Task', taskId);
    
    res.json({ 
      message: 'Task deleted successfully',
      deletedTask: {
        id: deletedTask._id,
        title: deletedTask.title
      }
    });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ 
      error: 'Failed to delete task', 
      details: error.message 
    });
  }
};