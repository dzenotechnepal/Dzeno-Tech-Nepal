import { Payslip } from '../models/Payslip.model.js';

export const generatePayslipNumber = async (year, month) => {
  try {
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `PS-${year}-${monthStr}-`;
    
    // Find the latest payslip for this month/year
    const lastPayslip = await Payslip.findOne({
      payslipNumber: { $regex: `^${prefix}` }
    }).sort({ payslipNumber: -1 });

    let nextNum = 1;
    if (lastPayslip && lastPayslip.payslipNumber) {
      const parts = lastPayslip.payslipNumber.split('-');
      const lastNum = parseInt(parts[3], 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }

    return `${prefix}${nextNum.toString().padStart(3, '0')}`;
  } catch (error) {
    throw new Error('Error generating payslip number');
  }
};
