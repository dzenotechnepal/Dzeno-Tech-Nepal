import { Setting } from '../models/Setting.model.js';

const fields = 'companyName companyEmail companyPhone companyAddress currency timezone defaultLeaveDays attendanceCutoff payslipFooter updatedAt';

const defaults = {
  companyName: 'Dzeno Tech Nepal',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  currency: 'NPR',
  timezone: 'Asia/Kathmandu',
  defaultLeaveDays: 0,
  attendanceCutoff: '18:00',
  payslipFooter: 'This is a computer-generated payslip.',
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne({ key: 'application' }).select(fields).lean();
    return res.status(200).json({ success: true, data: settings || defaults, message: 'Settings fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const allowed = {
      companyName: req.body.companyName,
      companyEmail: req.body.companyEmail,
      companyPhone: req.body.companyPhone,
      companyAddress: req.body.companyAddress,
      currency: req.body.currency,
      timezone: req.body.timezone,
      defaultLeaveDays: Number(req.body.defaultLeaveDays || 0),
      attendanceCutoff: req.body.attendanceCutoff,
      payslipFooter: req.body.payslipFooter,
      updatedBy: req.user.id,
    };
    if (!allowed.companyName?.trim()) return res.status(400).json({ success: false, message: 'Company name is required' });
    const settings = await Setting.findOneAndUpdate({ key: 'application' }, { $set: allowed, $setOnInsert: { key: 'application' } }, { new: true, upsert: true, runValidators: true }).select(fields);
    return res.status(200).json({ success: true, data: settings, message: 'Settings updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
