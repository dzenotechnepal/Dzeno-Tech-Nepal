import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'application' },
    companyName: { type: String, default: 'Dzeno Tech Nepal' },
    companyEmail: { type: String, default: '' },
    companyPhone: { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    currency: { type: String, default: 'NPR' },
    timezone: { type: String, default: 'Asia/Kathmandu' },
    defaultLeaveDays: { type: Number, min: 0, default: 0 },
    attendanceCutoff: { type: String, default: '18:00' },
    payslipFooter: { type: String, default: 'This is a computer-generated payslip.' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
