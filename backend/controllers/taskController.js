import { dbAll, dbGet, dbRun } from '../database/init.js';

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
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Audit log helper
const logAction = async (action, taskId, updatedContent = null) => {
  const contentString = updatedContent ? JSON.stringify(updatedContent) : null;
  await dbRun(
    'INSERT INTO audit_logs (action, taskId, updatedContent) VALUES (?, ?, ?)',
    [action, taskId, contentString]
  );
};

export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM tasks';
    let countQuery = 'SELECT COUNT(*) as total FROM tasks';
    const params = [];
    
    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const tasks = await dbAll(query, params.slice(0, params.length - 2).concat(limit, offset));
    const totalResult = await dbGet(countQuery, search ? [`%${search}%`, `%${search}%`] : []);
    const total = totalResult.total;
    
    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req, res) => {
  try {
    let { title, description } = req.body;
    
    // Sanitize inputs
    title = sanitizeInput(title);
    description = sanitizeInput(description);
    
    // Validate inputs
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const result = await dbRun(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    
    const taskId = result.lastID;
    
    // Log the creation action
    await logAction('Create Task', taskId, { title, description });
    
    res.status(201).json({ 
      id: taskId, 
      title, 
      description, 
      message: 'Task created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    let { title, description } = req.body;
    
    // Sanitize inputs
    title = sanitizeInput(title);
    description = sanitizeInput(description);
    
    // Validate inputs
    const errors = validateTask(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Get original task to compare changes
    const originalTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (!originalTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Determine changed fields
    const updatedContent = {};
    if (title !== originalTask.title) updatedContent.title = title;
    if (description !== originalTask.description) updatedContent.description = description;
    
    await dbRun(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
      [title, description, taskId]
    );
    
    // Log the update action with only changed fields
    await logAction('Update Task', taskId, updatedContent);
    
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await dbRun('DELETE FROM tasks WHERE id = ?', [taskId]);
    
    // Log the deletion action
    await logAction('Delete Task', taskId);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};