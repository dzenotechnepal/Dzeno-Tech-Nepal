import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import healthRouter from './routes/health.routes.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

connectDatabase()
	.then(() => {
		app.listen(port, () => {
			console.log(`Backend server running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error('MongoDB connection failed:', error.message);
		process.exit(1);
	});

export default app;
