import { User } from '../models/User.model.js';
import { Attendance } from '../models/Attendance.model.js';
import { Leave } from '../models/Leave.model.js';
import { Salary } from '../models/Salary.model.js';
import { Payslip } from '../models/Payslip.model.js';

export const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const todayDate = new Date();
    const [totalEmployees, totalPresentToday, totalOnLeave, salariesThisMonth, recentAttendance, recentPayslips] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Attendance.countDocuments({ date: today, status: { $in: ['present', 'half-day'] } }),
      Leave.countDocuments({ status: 'approved', startDate: { $lte: todayDate }, endDate: { $gte: todayDate } }),
      Salary.find({ month, year, isPaid: true }).select('netPay').lean(),
      Attendance.find({ date: today }).select('employeeId checkIn status createdAt').populate('employeeId', 'name avatar').limit(5).sort({ createdAt: -1 }).lean(),
      Payslip.find().select('employeeId payslipNumber monthName year createdAt').populate('employeeId', 'name').limit(5).sort({ createdAt: -1 }).lean(),
    ]);

    const totalSalaryPayout = salariesThisMonth.reduce((acc, curr) => acc + curr.netPay, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalPresentToday,
        totalOnLeave,
        totalSalaryPayout,
        recentAttendance,
        recentPayslips
      },
      message: 'Dashboard stats fetched'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
