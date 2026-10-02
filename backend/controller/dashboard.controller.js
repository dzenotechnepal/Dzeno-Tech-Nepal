import { User } from "../models/User.model.js";
import { Attendance } from "../models/Attendance.model.js";
import { Leave } from "../models/Leave.model.js";
import { Salary } from "../models/Salary.model.js";
import { Payslip } from "../models/Payslip.model.js";

export const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const canViewCompanyStats = ["superadmin", "admin", "ceo"].includes(req.user.role);
    if (!canViewCompanyStats) {
      const [attendance, leaves, salary, payslip] = await Promise.all([
        Attendance.find({ employeeId: req.user.id, month, year })
          .select("status workHours date")
          .lean(),
        Leave.find({ employeeId: req.user.id })
          .sort({ createdAt: -1 })
          .limit(20)
          .select("status leaveType startDate endDate totalDays")
          .lean(),
        Salary.findOne({ employeeId: req.user.id, month, year })
          .select("isPaid netPay monthName year")
          .lean(),
        Payslip.findOne({ employeeId: req.user.id })
          .sort({ year: -1, month: -1 })
          .select("payslipNumber monthName year createdAt")
          .lean(),
      ]);

      const attendanceSummary = attendance.reduce(
        (summary, record) => {
          if (record.status === "present") summary.present += 1;
          if (record.status === "half-day") summary.halfDay += 1;
          if (record.status === "absent") summary.absent += 1;
          if (record.status === "leave") summary.leave += 1;
          summary.totalHours += record.workHours || 0;
          return summary;
        },
        { present: 0, halfDay: 0, absent: 0, leave: 0, totalHours: 0 },
      );

      return res.status(200).json({
        success: true,
        data: {
          scope: "self",
          month,
          year,
          attendanceSummary: {
            ...attendanceSummary,
            totalHours: Number(attendanceSummary.totalHours.toFixed(2)),
          },
          leaveSummary: {
            pending: leaves.filter((leave) => leave.status === "pending").length,
            approved: leaves.filter((leave) => leave.status === "approved").length,
            rejected: leaves.filter((leave) => leave.status === "rejected").length,
          },
          salary: salary
            ? {
                status: salary.isPaid ? "Paid" : "Pending",
                netPay: salary.netPay,
                monthName: salary.monthName,
                year: salary.year,
              }
            : null,
          payslip,
        },
        message: "Personal dashboard stats fetched",
      });
    }
    const todayDate = new Date();
    const [
      totalEmployees,
      totalPresentToday,
      totalOnLeave,
      salariesThisMonth,
      recentAttendance,
      recentPayslips,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Attendance.countDocuments({ date: today, status: { $in: ["present", "half-day"] } }),
      Leave.countDocuments({
        status: "approved",
        startDate: { $lte: todayDate },
        endDate: { $gte: todayDate },
      }),
      Salary.find({ month, year, isPaid: true }).select("netPay").lean(),
      Attendance.find({ date: today })
        .select("employeeId checkIn status createdAt")
        .populate("employeeId", "name avatar")
        .limit(5)
        .sort({ createdAt: -1 })
        .lean(),
      Payslip.find()
        .select("employeeId payslipNumber monthName year createdAt")
        .populate("employeeId", "name")
        .limit(5)
        .sort({ createdAt: -1 })
        .lean(),
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
        recentPayslips,
      },
      message: "Dashboard stats fetched",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
