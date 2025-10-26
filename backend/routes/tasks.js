import express from 'express';
import { basicAuth } from '../middleware/auth.js';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.js';

const router = express.Router();

// All routes require authentication
router.use(basicAuth);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;