import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';

import { connectDatabase } from './config/database.js';
import { User } from './models/User.model.js';

import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import attendanceRouter from './routes/attendance.routes.js';
import salaryRouter from './routes/salary.routes.js';
import payslipRouter from './routes/payslip.routes.js';
import leaveRouter from './routes/leave.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Seeder endpoint
app.post('/api/seed/superadmin', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ success: false, message: 'Seeding failed: Users already exist in the database' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('SuperAdmin@123', salt);

    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@eightbit.com.np',
      password: hashedPassword,
      role: 'superadmin',
      designation: 'System Administrator',
      department: 'Management',
      isActive: true
    });

    await superAdmin.save();
    return res.status(201).json({ success: true, message: 'Superadmin created successfully' });
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
