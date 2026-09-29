import { Leave } from '../models/Leave.model.js';

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason?.trim()) {
      return res.status(400).json({ success: false, message: 'Leave type, dates, and reason are required' });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    const leave = new Leave({
      employeeId: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays: Number(totalDays) || 1,
      reason,
      status: 'pending'
    });

    await leave.save();
    return res.status(201).json({ success: true, data: leave, message: 'Leave applied successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    // Admin sees all, employees see own unless handled via route middleware
    // Here we assume admin is viewing all if they call this base route
    // and employees have a different view, or we can check role
    let query = {};
    if (['developer', 'employee'].includes(req.user.role)) {
      query.employeeId = req.user.id;
    }

    const leaves = await Leave.find(query).populate('employeeId', 'name employeeId').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: leaves, message: 'Leaves fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      approvedBy: req.user.id
    }, { new: true });

    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    return res.status(200).json({ success: true, data: leave, message: 'Leave approved' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      approvedBy: req.user.id
    }, { new: true });

    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    return res.status(200).json({ success: true, data: leave, message: 'Leave rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    const isAdmin = ['superadmin', 'admin', 'ceo'].includes(req.user.role);
    if (!isAdmin && String(leave.employeeId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own leave' });
    }
    if (!isAdmin && leave.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending leave can be cancelled' });
    }
    await leave.deleteOne();
    return res.status(200).json({ success: true, message: 'Leave cancelled' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: leaves, message: 'Employee leaves fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
