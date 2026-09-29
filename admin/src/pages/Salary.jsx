import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Salary = () => {
  const navigate = useNavigate();
  const [salaries] = useState([
    { id: 1, employeeName: 'Sujan Aryal', monthYear: 'April 2024', basic: 21000, da: 14000, ssfEmployer: 4200, gross: 39200, ssfDeduction: 6510, cit: 0, netPay: 32690, status: 'Paid' },
    { id: 2, employeeName: 'Ram Thapa', monthYear: 'April 2024', basic: 25000, da: 10000, ssfEmployer: 5000, gross: 40000, ssfDeduction: 7750, cit: 0, netPay: 32250, status: 'Pending' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [specificAmount, setSpecificAmount] = useState(35000);
  const basic = specificAmount * 0.6225;
  const da = specificAmount * 0.3775;

  const ssfEmployer = basic * 0.2;
  const gross = basic + da + ssfEmployer;
  const ssfDeduction = basic * 0.31;
  const netPay = gross - ssfEmployer - ssfDeduction;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Salary Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Salary Record</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Basic</th>
                <th>DA</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map(salary => (
                <tr key={salary.id}>
                  <td className="font-medium">{salary.employeeName}</td>
                  <td>{salary.monthYear}</td>
                  <td>{salary.basic.toLocaleString()}</td>
                  <td>{salary.da.toLocaleString()}</td>
                  <td>{salary.gross.toLocaleString()}</td>
                  <td>{salary.ssfDeduction.toLocaleString()}</td>
                  <td className="font-bold">{salary.netPay.toLocaleString()}</td>
                  <td>
                    <Badge type={salary.status === 'Paid' ? 'green' : 'yellow'}>{salary.status}</Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {salary.status === 'Pending' && <button className="text-success hover:underline text-sm">Mark Paid</button>}
                      {salary.status === 'Paid' && <button className="text-accent-blue hover:underline text-sm" onClick={() => navigate(`/admin/payslips/${salary.id}`)}>Payslip</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Salary Record">
        <div className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Employee</label>
            <select className="select">
              <option>Select Employee...</option>
              <option>Sujan Aryal</option>
              <option>Ram Thapa</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select className="select">
                <option>April</option>
                <option>May</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="select">
                <option>2024</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Specific Amount</label>
              <input type="number" className="input" value={specificAmount} onChange={(e) => setSpecificAmount(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Basic Salary (62.25%)</label>
              <input type="text" className="input" value={basic.toFixed(2)} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">DA (37.75%)</label>
              <input type="text" className="input" value={da.toFixed(2)} readOnly />
            </div>
          </div>
          <div className="bg-bg-tertiary p-4 rounded-md text-sm">
            <div className="flex justify-between mb-1"><span>SSF Employer (20%):</span> <span>{ssfEmployer.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1 font-bold"><span>Total Gross:</span> <span>{gross.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1 text-danger"><span>SSF Deduction (31%):</span> <span>-{ssfDeduction.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1 text-danger"><span>Tax:</span> <span>-0</span></div>
            <hr className="border-border-color my-2" />
            <div className="flex justify-between font-bold text-success text-base"><span>Net Pay:</span> <span>{netPay.toLocaleString()}</span></div>
          </div>
          <button className="btn btn-primary w-full mt-2" onClick={() => setIsModalOpen(false)}>Save Salary Record</button>
        </div>
      </Modal>
    </div>
  );
};

export default Salary;
