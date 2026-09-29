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
  },
  { timestamps: true }
);

export const Payslip = mongoose.model('Payslip', payslipSchema);
