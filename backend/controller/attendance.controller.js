import { Attendance } from '../models/Attendance.model.js';

export const checkIn = async (req, res) => {
  try {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const existing = await Attendance.findOne({ employeeId: req.user.id, date });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    const attendance = new Attendance({
      employeeId: req.user.id,
      date,
      checkIn: time,
      month,
      year,
      status: 'present'
    });

    await attendance.save();
    return res.status(201).json({ success: true, data: attendance, message: 'Checked in successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const attendance = await Attendance.findOne({ employeeId: req.user.id, date });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No check-in found for today' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out today' });
    }

    attendance.checkOut = time;

    // Compute work hours
    const [inH, inM] = attendance.checkIn.split(':').map(Number);
    const [outH, outM] = time.split(':').map(Number);
    const inTime = inH + inM / 60;
    const outTime = outH + outM / 60;
    let workHours = outTime - inTime;
    if (workHours < 0) workHours += 24; // If over midnight

    attendance.workHours = parseFloat(workHours.toFixed(2));
    
    if (attendance.workHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    return res.status(200).json({ success: true, data: attendance, message: 'Checked out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceList = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = parseInt(month, 10);
    if (year) query.year = parseInt(year, 10);

    const attendances = await Attendance.find(query).populate('employeeId', 'name employeeId').sort({ date: -1 });
    return res.status(200).json({ success: true, data: attendances, message: 'Attendance fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, note } = req.body;
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    let attendance = await Attendance.findOne({ employeeId, date });
    if (attendance) {
      attendance.status = status || attendance.status;
      if (checkIn) attendance.checkIn = checkIn;
      if (checkOut) attendance.checkOut = checkOut;
      if (note) attendance.note = note;
    } else {
      attendance = new Attendance({
        employeeId, date, status, checkIn, checkOut, note, month, year
      });
    }

    if (attendance.checkIn && attendance.checkOut) {
      const [inH, inM] = attendance.checkIn.split(':').map(Number);
      const [outH, outM] = attendance.checkOut.split(':').map(Number);
      const inTime = inH + inM / 60;
      const outTime = outH + outM / 60;
      let workHours = outTime - inTime;
      if (workHours < 0) workHours += 24;
      attendance.workHours = parseFloat(workHours.toFixed(2));
    }

    await attendance.save();
    return res.status(200).json({ success: true, data: attendance, message: 'Attendance marked manually' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.find({ employeeId: req.params.id }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: attendances, message: 'Employee attendance fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const qMonth = parseInt(month, 10) || new Date().getMonth() + 1;
    const qYear = parseInt(year, 10) || new Date().getFullYear();

    const attendances = await Attendance.find({ 
      employeeId: req.params.id,
      month: qMonth,
      year: qYear
    });

    const summary = {
      present: 0,
      absent: 0,
      halfDay: 0,
      leave: 0,
      totalHours: 0
    };

    attendances.forEach(a => {
      if (a.status === 'present') summary.present += 1;
      else if (a.status === 'absent') summary.absent += 1;
      else if (a.status === 'half-day') summary.halfDay += 1;
      else if (a.status === 'leave') summary.leave += 1;
      summary.totalHours += a.workHours || 0;
    });

    summary.totalHours = parseFloat(summary.totalHours.toFixed(2));

    return res.status(200).json({ success: true, data: summary, message: 'Monthly summary fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
