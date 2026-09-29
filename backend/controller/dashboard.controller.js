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

    const totalEmployees = await User.countDocuments({ isActive: true });
    const totalPresentToday = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'half-day'] } });
    
    // Total on leave today (approved leaves covering today's date)
    const todayDate = new Date();
    const totalOnLeave = await Leave.countDocuments({
      status: 'approved',
      startDate: { $lte: todayDate },
      endDate: { $gte: todayDate }
    });

    const salariesThisMonth = await Salary.find({ month, year, isPaid: true });
    const totalSalaryPayout = salariesThisMonth.reduce((acc, curr) => acc + curr.netPay, 0);

    const recentAttendance = await Attendance.find({ date: today })
      .populate('employeeId', 'name avatar')
      .limit(5)
      .sort({ createdAt: -1 });

    const recentPayslips = await Payslip.find()
      .populate('employeeId', 'name')
      .limit(5)
      .sort({ createdAt: -1 });

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
