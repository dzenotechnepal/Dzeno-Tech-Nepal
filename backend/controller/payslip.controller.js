import { Payslip } from "../models/Payslip.model.js";
import { Salary } from "../models/Salary.model.js";
import { User } from "../models/User.model.js";
import { generatePayslipNumber } from "../utils/payslipNumber.utils.js";
import mongoose from "mongoose";
import { Attendance } from "../models/Attendance.model.js";

export const generatePayslip = async (req, res) => {
  try {
    const { salaryId } = req.body;
    const salary = await Salary.findById(salaryId);

    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }

    const existingPayslip = await Payslip.findOne({ salaryId });
    if (existingPayslip) {
      return res
        .status(400)
        .json({ success: false, message: "Payslip already generated for this salary" });
    }

    const payslipNumber = await generatePayslipNumber(salary.year, salary.month);
    const attendanceRecords = await Attendance.find({
      employeeId: salary.employeeId,
      month: salary.month,
      year: salary.year,
    })
      .select("status workHours")
      .lean();
    const attendanceSummary = attendanceRecords.reduce(
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

    const payslip = new Payslip({
      employeeId: salary.employeeId,
      salaryId: salary._id,
      month: salary.month,
      year: salary.year,
      monthName: salary.monthName,
      generatedBy: req.user.id,
      payslipNumber,
      attendanceSummary: {
        ...attendanceSummary,
        totalHours: parseFloat(attendanceSummary.totalHours.toFixed(2)),
      },
    });

    await payslip.save();
    return res.status(201).json({ success: true, data: payslip, message: "Payslip generated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find()
      .populate("employeeId", "name employeeId panNumber designation")
      .populate("salaryId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: payslips, message: "Payslips fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslipById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Payslip not found" });
    }

    const payslip = await Payslip.findById(req.params.id)
      .populate(
        "employeeId",
        "name employeeId panNumber designation department bankName bankAccountHolderName bankAccountNumber bankBranch ssfEnrolled",
      )
      .populate("salaryId")
      .populate("generatedBy", "name");

    if (!payslip) {
      return res.status(404).json({ success: false, message: "Payslip not found" });
    }
    if (
      ["developer", "employee", "intern"].includes(req.user.role) &&
      String(payslip.employeeId._id) !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You can only view your own payslips" });
    }
    return res.status(200).json({ success: true, data: payslip, message: "Payslip fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeePayslips = async (req, res) => {
  try {
    const employeeId =
      req.params.id === "me" || ["developer", "employee", "intern"].includes(req.user.role)
        ? req.user.id
        : req.params.id;

    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ success: false, message: "Invalid employee ID" });
    }

    const payslips = await Payslip.find({ employeeId })
      .populate("employeeId", "name employeeId designation")
      .populate("salaryId")
      .sort({ year: -1, month: -1 });
    return res
      .status(200)
      .json({ success: true, data: payslips, message: "Employee payslips fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find({ employeeId: req.user.id })
      .populate("employeeId", "name employeeId designation")
      .populate("salaryId")
      .sort({ year: -1, month: -1 });

    return res.status(200).json({ success: true, data: payslips, message: "My payslips fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
