import { Leave } from '../models/Leave.model.js';

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    const leave = new Leave({
      employeeId: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays,
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

export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: leaves, message: 'Employee leaves fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
