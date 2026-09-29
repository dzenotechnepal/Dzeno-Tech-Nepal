import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    monthName: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payslipNumber: { type: String, required: true, unique: true },
    attendanceSummary: {
      present: { type: Number, default: 0 },
      halfDay: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      leave: { type: Number, default: 0 },
      totalHours: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

payslipSchema.index({ createdAt: -1 });
payslipSchema.index({ employeeId: 1, year: -1, month: -1 });

export const Payslip = mongoose.model('Payslip', payslipSchema);
