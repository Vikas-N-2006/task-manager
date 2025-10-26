import express from 'express';
import { basicAuth } from '../middleware/auth.js';
import { getLogs } from '../controllers/logController.js';

const router = express.Router();

router.use(basicAuth);
router.get('/', getLogs);

export default router;