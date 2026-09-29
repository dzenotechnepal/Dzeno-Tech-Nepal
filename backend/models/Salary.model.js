import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    monthName: { type: String, required: true },
    monthlyBasicSalary: { type: Number, required: true },
    dearnessAllowance: { type: Number, required: true, default: 0 },
    ssfEmployerContribution: { type: Number, required: true },
    totalGrossPay: { type: Number, required: true },
    ssfEmployeeContribution: { type: Number, required: true },
    citAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidDate: { type: Date },
    payPeriodStart: { type: Date, required: true },
    payPeriodEnd: { type: Date, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

salarySchema.index({ month: 1, year: 1, isPaid: 1 });
salarySchema.index({ employeeId: 1, year: -1, month: -1 });

export const Salary = mongoose.model('Salary', salarySchema);
