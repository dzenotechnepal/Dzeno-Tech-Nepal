/**
 * Compute Nepal SSF salary breakdown for Eight Bit Pvt. Ltd.
 *
 * Payslip rules:
 *  - SSF Employer Contribution (20%): added to gross   → basicSalary * 0.20
 *  - Total Gross Pay:                                  → basic + DA + ssfEmployer
 *  - Less: Contribution to SSF (31%): deducted         → basicSalary * 0.31  (employee share deducted from pay)
 *  - Less: CIT Contribution:                           → configurable, default 0
 *  - Net Pay = grossPay − ssfEmployeeDeduction − citAmount
 *
 * Example: basic=21000, DA=14000
 *   ssfEmployer = 4200, gross = 39200, ssfDeduction = 6510, net = 32690
 */
export const computeSalaryBreakdown = (basicSalary, dearnessAllowance = 0, citAmount = 0) => {
  const ssfEmployerContribution = parseFloat((basicSalary * 0.20).toFixed(2));
  const totalGrossPay = parseFloat((basicSalary + dearnessAllowance + ssfEmployerContribution).toFixed(2));
  // 31% of basic deducted from employee pay (combined SSF rate shown on payslip)
  const ssfEmployeeDeduction = parseFloat((basicSalary * 0.31).toFixed(2));
  const netPay = parseFloat((totalGrossPay - ssfEmployeeDeduction - citAmount).toFixed(2));

  return {
    monthlyBasicSalary: basicSalary,
    dearnessAllowance,
    ssfEmployerContribution,
    totalGrossPay,
    ssfEmployeeDeduction,
    citAmount,
    netPay,
  };
};
