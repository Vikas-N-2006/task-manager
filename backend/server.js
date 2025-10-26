import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/tasks.js';
import logRoutes from './routes/logs.js';
import { initDatabase } from './database/init.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});