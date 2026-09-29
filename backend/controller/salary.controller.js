import { Salary } from '../models/Salary.model.js';
import { User } from '../models/User.model.js';
import { computeSalaryBreakdown } from '../utils/salary.utils.js';

export const createSalary = async (req, res) => {
  try {
    const { employeeId, month, year, monthlyBasicSalary, dearnessAllowance, taxAmount, payPeriodStart, payPeriodEnd } = req.body;

    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

    const breakdown = computeSalaryBreakdown(Number(monthlyBasicSalary), Number(dearnessAllowance || 0));

    // Deduct tax from netPay after initial computation
    const finalTaxAmount = Number(taxAmount || 0);
    const finalNetPay = breakdown.netPay - finalTaxAmount;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month - 1];

    const salary = new Salary({
      employeeId,
      month,
      year,
      monthName,
      monthlyBasicSalary: breakdown.monthlyBasicSalary,
      dearnessAllowance: breakdown.dearnessAllowance,
      ssfEmployerContribution: breakdown.ssfEmployerContribution,
      totalGrossPay: breakdown.totalGrossPay,
      ssfEmployeeContribution: breakdown.ssfEmployeeDeduction,
      citAmount: breakdown.citAmount,
      taxAmount: finalTaxAmount,
      netPay: finalNetPay,
      payPeriodStart,
      payPeriodEnd,
      generatedBy: req.user.id
    });

    await salary.save();

    return res.status(201).json({ success: true, data: salary, message: 'Salary record created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalaries = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    const query = {};
    if (month) query.month = month;
    if (year) query.year = year;
    if (employeeId) query.employeeId = employeeId;

    const salaries = await Salary.find(query).populate('employeeId', 'name employeeId designation').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: salaries, message: 'Salaries fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate('employeeId', 'name employeeId designation');
    if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });
    return res.status(200).json({ success: true, data: salary, message: 'Salary fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { monthlyBasicSalary, dearnessAllowance, taxAmount, payPeriodStart, payPeriodEnd, isPaid } = req.body;
    
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });

    let finalNetPay = salary.netPay;
    let finalTaxAmount = salary.taxAmount;

    if (monthlyBasicSalary !== undefined || dearnessAllowance !== undefined) {
      const basic = monthlyBasicSalary !== undefined ? Number(monthlyBasicSalary) : salary.monthlyBasicSalary;
      const da = dearnessAllowance !== undefined ? Number(dearnessAllowance) : salary.dearnessAllowance;
      const breakdown = computeSalaryBreakdown(basic, da);
      
      salary.monthlyBasicSalary = breakdown.monthlyBasicSalary;
      salary.dearnessAllowance = breakdown.dearnessAllowance;
      salary.ssfEmployerContribution = breakdown.ssfEmployerContribution;
      salary.totalGrossPay = breakdown.totalGrossPay;
      salary.ssfEmployeeContribution = breakdown.ssfEmployeeDeduction;
      salary.citAmount = breakdown.citAmount;
      
      finalTaxAmount = taxAmount !== undefined ? Number(taxAmount) : salary.taxAmount;
      finalNetPay = breakdown.netPay - finalTaxAmount;
    } else if (taxAmount !== undefined) {
      finalTaxAmount = Number(taxAmount);
      // Recompute net pay with new tax but old breakdown
      const oldGrossAfterDeds = salary.totalGrossPay - salary.ssfEmployeeContribution - salary.citAmount;
      finalNetPay = oldGrossAfterDeds - finalTaxAmount;
    }

    salary.taxAmount = finalTaxAmount;
    salary.netPay = finalNetPay;
    if (payPeriodStart) salary.payPeriodStart = payPeriodStart;
    if (payPeriodEnd) salary.payPeriodEnd = payPeriodEnd;
    if (isPaid !== undefined) {
      salary.isPaid = isPaid;
      if (isPaid && !salary.paidDate) salary.paidDate = new Date();
    }

    await salary.save();
    return res.status(200).json({ success: true, data: salary, message: 'Salary updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.id }).sort({ year: -1, month: -1 });
    return res.status(200).json({ success: true, data: salaries, message: 'Employee salaries fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const paySalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, {
      isPaid: true,
      paidDate: new Date()
    }, { new: true });
    
    if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });
    return res.status(200).json({ success: true, data: salary, message: 'Salary marked as paid' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
