import { Leave } from "../models/Leave.model.js";
import { User } from "../models/User.model.js";
import {
  sendLeaveAppliedEmail,
  sendLeaveStatusEmail,
  isEmailConfigured,
} from "../services/email.service.js";

// ─── Helper: format date as "YYYY-MM-DD" from a Date/string ──────────────────
const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);

// ─── Helper: resolve admin URL from env (same logic as welcome email) ─────────
const getAdminUrl = () => {
  const urls = (process.env.ADMIN_URL || "").split(",").map((u) => u.trim()).filter(Boolean);
  return (
    process.env.ADMIN_LOGIN_URL ||
    urls.find((u) => u.startsWith("https://")) ||
    urls[0] ||
    "http://localhost:5174"
  );
};

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Leave type, dates, and reason are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ success: false, message: "End date cannot be before start date" });
    }

    const leave = new Leave({
      employeeId: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays: Number(totalDays) || 1,
      reason,
      status: "pending",
    });

    await leave.save();

    // ── Fire email to all admins / CEO (non-blocking) ──────────────────────
    if (isEmailConfigured()) {
      User.find({ role: { $in: ["superadmin", "admin", "ceo"] }, isActive: true })
        .select("email")
        .lean()
        .then((admins) => {
          const adminEmails = admins.map((a) => a.email).filter(Boolean);
          if (!adminEmails.length) return;
          return sendLeaveAppliedEmail({
            adminEmails,
            employeeName: req.user.name,
            employeeId: req.user.employeeId || req.user._id.toString(),
            leaveType,
            startDate: fmtDate(startDate),
            endDate: fmtDate(endDate),
            totalDays: Number(totalDays) || 1,
            reason,
            adminUrl: getAdminUrl(),
          });
        })
        .catch((err) =>
          console.error("[email] leave applied notification failed:", err.message),
        );
    }

    return res
      .status(201)
      .json({ success: true, data: leave, message: "Leave applied successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    let query = {};
    if (["developer", "employee", "intern"].includes(req.user.role)) {
      query.employeeId = req.user.id;
    }

    const leaves = await Leave.find(query)
      .populate("employeeId", "name employeeId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: leaves, message: "Leaves fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "approved", approvedBy: req.user.id },
      { new: true },
    ).populate("employeeId", "name email employeeId");

    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

    // ── Notify employee (non-blocking) ─────────────────────────────────────
    if (isEmailConfigured() && leave.employeeId?.email) {
      const note = req.body?.note || "";
      sendLeaveStatusEmail({
        employeeEmail: leave.employeeId.email,
        employeeName: leave.employeeId.name,
        leaveType: leave.leaveType,
        startDate: fmtDate(leave.startDate),
        endDate: fmtDate(leave.endDate),
        totalDays: leave.totalDays,
        status: "approved",
        reviewerName: req.user.name,
        note,
      }).catch((err) =>
        console.error("[email] leave approved notification failed:", err.message),
      );
    }

    return res.status(200).json({ success: true, data: leave, message: "Leave approved" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", approvedBy: req.user.id },
      { new: true },
    ).populate("employeeId", "name email employeeId");

    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

    // ── Notify employee (non-blocking) ─────────────────────────────────────
    if (isEmailConfigured() && leave.employeeId?.email) {
      const note = req.body?.note || "";
      sendLeaveStatusEmail({
        employeeEmail: leave.employeeId.email,
        employeeName: leave.employeeId.name,
        leaveType: leave.leaveType,
        startDate: fmtDate(leave.startDate),
        endDate: fmtDate(leave.endDate),
        totalDays: leave.totalDays,
        status: "rejected",
        reviewerName: req.user.name,
        note,
      }).catch((err) =>
        console.error("[email] leave rejected notification failed:", err.message),
      );
    }

    return res.status(200).json({ success: true, data: leave, message: "Leave rejected" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });
    const isAdmin = ["superadmin", "admin", "ceo"].includes(req.user.role);
    if (!isAdmin && String(leave.employeeId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "You can only cancel your own leave" });
    }
    if (!isAdmin && leave.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Only pending leave can be cancelled" });
    }
    await leave.deleteOne();
    return res.status(200).json({ success: true, message: "Leave cancelled" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, data: leaves, message: "Employee leaves fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

