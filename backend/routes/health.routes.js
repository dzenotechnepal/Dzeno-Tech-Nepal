import { Router } from 'express';
import { getDatabaseStatus } from '../config/database.js';

const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    database: getDatabaseStatus(),
    service: 'dzenotechnepal-backend',
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
