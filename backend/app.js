import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { connectToMongoDB } from './config/database.js';
import { seedSuperAdmin } from './utils/seedSuperAdmin.js';
import { isEmailConfigured, verifyEmailTransport } from './services/email.service.js';

import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import attendanceRouter from './routes/attendance.routes.js';
import salaryRouter from './routes/salary.routes.js';
import payslipRouter from './routes/payslip.routes.js';
import leaveRouter from './routes/leave.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import customerRouter from './routes/customer.routes.js';
import productRouter from './routes/product.routes.js';
import holidayRouter from './routes/holiday.routes.js';
import contractRouter from './routes/contract.routes.js';
import settingRouter from './routes/setting.routes.js';
import emailRouter from './routes/email.routes.js';
import submissionRouter from './routes/submission.routes.js';
import openingRouter from './routes/opening.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
const normalizeOrigin = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return (trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`).replace(/\/$/, '');
};

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://admin.dzenotechnepal.com.np',
  'http://admin.dzenotechnepal.com.np',
  'https://dzenotechnepal.com.np',
  'http://dzenotechnepal.com.np',
  'https://www.dzenotechnepal.com.np',
  'http://www.dzenotechnepal.com.np',
].map(normalizeOrigin);

if (process.env.FRONTEND_URL) allowedOrigins.push(...process.env.FRONTEND_URL.split(',').map(normalizeOrigin));
if (process.env.ADMIN_URL) allowedOrigins.push(...process.env.ADMIN_URL.split(',').map(normalizeOrigin));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or if origin is in our allowed list
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Seeder endpoint
app.post('/api/seed/superadmin', async (req, res) => {
  try {
    const result = await seedSuperAdmin();
    return res.status(result.created ? 201 : 200).json({
      success: true,
      message: result.created ? 'Superadmin created successfully' : 'Superadmin already exists',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/payslips', payslipRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/customers', customerRouter);
app.use('/api/products', productRouter);
app.use('/api/holidays', holidayRouter);
app.use('/api/contracts', contractRouter);
app.use('/api/settings', settingRouter);
app.use('/api/email', emailRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/openings', openingRouter);

connectToMongoDB()
  .then(() => {
    return seedSuperAdmin();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`);
      if (!isEmailConfigured()) {
        console.warn('[email] SMTP is not configured');
        return;
      }

      verifyEmailTransport()
        .then(() => console.log('[email] MailerSend configuration verified'))
        .catch((error) => console.error('[email] MailerSend configuration check failed', {
          reason: error.message,
          code: error.code,
          response: error.response,
        }));
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

export default app;
