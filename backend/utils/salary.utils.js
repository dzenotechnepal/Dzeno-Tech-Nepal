/**
 * Compute Nepal salary breakdown for Dzeno Tech Nepal
 *
 * Payslip rules:
 *  - Basic Salary:                                    → specificAmount * 0.6225
 *  - Dearness Allowance (DA):                        → specificAmount * 0.3775
 *  - SSF Employer Contribution (20%): added to gross   → basicSalary * 0.20 when enrolled
 *  - Total Gross Pay:                                  → basic + DA + ssfEmployer
 *  - Less: Contribution to SSF (31%): deducted         → basicSalary * 0.31 when enrolled
 *  - Less: Tax:                                        → specificAmount * 0.01 when not enrolled
 *  - Less: CIT Contribution:                           → configurable, default 0
 *  - Net Pay = grossPay − ssfEmployeeDeduction − citAmount
 *
 * Example: basic=21000, DA=14000
 *   ssfEmployer = 4200, gross = 39200, ssfDeduction = 6510, net = 32690
 */
export const computeSalaryBreakdown = (specificAmount, citAmount = 0, ssfEnrolled = true) => {
  const amount = Number(specificAmount) || 0;
  const basicSalary = parseFloat((amount * 0.6225).toFixed(2));
  const dearnessAllowance = parseFloat((amount * 0.3775).toFixed(2));
  const ssfEmployerContribution = ssfEnrolled ? parseFloat((basicSalary * 0.20).toFixed(2)) : 0;
  const totalGrossPay = parseFloat((basicSalary + dearnessAllowance + ssfEmployerContribution).toFixed(2));
  // 31% of basic deducted from employee pay (combined SSF rate shown on payslip)
  const ssfEmployeeDeduction = ssfEnrolled ? parseFloat((basicSalary * 0.31).toFixed(2)) : 0;
  const taxAmount = ssfEnrolled ? 0 : parseFloat((amount * 0.01).toFixed(2));
  const netPay = parseFloat((totalGrossPay - ssfEmployeeDeduction - citAmount - taxAmount).toFixed(2));

  return {
    monthlyBasicSalary: basicSalary,
    dearnessAllowance,
    ssfEmployerContribution,
    totalGrossPay,
    ssfEmployeeDeduction,
    citAmount,
    taxAmount,
    netPay,
  };
};
