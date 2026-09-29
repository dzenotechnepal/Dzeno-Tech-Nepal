import { Payslip } from '../models/Payslip.model.js';
import { Salary } from '../models/Salary.model.js';
import { User } from '../models/User.model.js';
import { generatePayslipNumber } from '../utils/payslipNumber.utils.js';

export const generatePayslip = async (req, res) => {
  try {
    const { salaryId } = req.body;
    const salary = await Salary.findById(salaryId);
    
    if (!salary) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }

    const existingPayslip = await Payslip.findOne({ salaryId });
    if (existingPayslip) {
      return res.status(400).json({ success: false, message: 'Payslip already generated for this salary' });
    }

    const payslipNumber = await generatePayslipNumber(salary.year, salary.month);

    const payslip = new Payslip({
      employeeId: salary.employeeId,
      salaryId: salary._id,
      month: salary.month,
      year: salary.year,
      monthName: salary.monthName,
      generatedBy: req.user.id,
      payslipNumber
    });

    await payslip.save();
    return res.status(201).json({ success: true, data: payslip, message: 'Payslip generated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find()
      .populate('employeeId', 'name employeeId panNumber designation')
      .populate('salaryId')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: payslips, message: 'Payslips fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id)
      .populate('employeeId', 'name employeeId panNumber designation department bankName bankAccountNumber bankBranch bankIFSC')
      .populate('salaryId')
      .populate('generatedBy', 'name');
      
    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip not found' });
    }
    return res.status(200).json({ success: true, data: payslip, message: 'Payslip fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeePayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find({ employeeId: req.params.id })
      .populate('salaryId')
      .sort({ year: -1, month: -1 });
    return res.status(200).json({ success: true, data: payslips, message: 'Employee payslips fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
