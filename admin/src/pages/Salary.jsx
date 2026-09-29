import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentDate = new Date();
const toInputDate = (date) => date.toISOString().slice(0, 10);

const Salary = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: String(currentDate.getMonth() + 1),
    year: String(currentDate.getFullYear()),
    specificAmount: '',
    taxAmount: '0',
    payPeriodStart: toInputDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)),
    payPeriodEnd: toInputDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salaryResponse, employeeResponse] = await Promise.all([
        api.get('/salary'),
        api.get('/users', { params: { limit: 100 } }),
      ]);
      setSalaries(Array.isArray(salaryResponse.data.data) ? salaryResponse.data.data : []);
      const employeeData = employeeResponse.data.data;
      setEmployees(Array.isArray(employeeData) ? employeeData : employeeData?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load salary data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const specificAmount = Number(formData.specificAmount) || 0;
  const basic = specificAmount * 0.6225;
  const da = specificAmount * 0.3775;
  const ssfEmployer = basic * 0.2;
  const gross = basic + da + ssfEmployer;
  const ssfDeduction = basic * 0.31;
  const tax = Number(formData.taxAmount) || 0;
  const netPay = gross - ssfEmployer - ssfDeduction - tax;
  const formatMoney = (value) => Number(value || 0).toLocaleString('en-NP', { maximumFractionDigits: 2 });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingSalaryId(null);
    setFormData(previous => ({ ...previous, employeeId: '', specificAmount: '', taxAmount: '0' }));
    setIsModalOpen(true);
  };

  const openEditModal = (salary) => {
    setEditingSalaryId(salary._id);
    setFormData({
      employeeId: salary.employeeId?._id || salary.employeeId || '',
      month: String(salary.month),
      year: String(salary.year),
      specificAmount: String(Number(salary.monthlyBasicSalary || 0) + Number(salary.dearnessAllowance || 0)),
      taxAmount: String(salary.taxAmount || 0),
      payPeriodStart: salary.payPeriodStart ? new Date(salary.payPeriodStart).toISOString().slice(0, 10) : '',
      payPeriodEnd: salary.payPeriodEnd ? new Date(salary.payPeriodEnd).toISOString().slice(0, 10) : '',
    });
    setIsModalOpen(true);
  };

  const createSalary = async (event) => {
    event.preventDefault();
    if (!formData.employeeId || specificAmount <= 0) {
      toast.error('Select an employee and enter a valid specific amount');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        month: Number(formData.month),
        year: Number(formData.year),
        specificAmount,
        taxAmount: tax,
      };
      if (editingSalaryId) {
        await api.put(`/salary/${editingSalaryId}`, payload);
      } else {
        await api.post('/salary/create', payload);
      }
      toast.success(editingSalaryId ? 'Salary record updated' : 'Salary record created');
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create salary record');
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (salaryId) => {
    try {
      await api.post(`/salary/${salaryId}/pay`);
      toast.success('Salary marked as paid');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark salary as paid');
    }
  };

  const generatePayslip = async (salaryId) => {
    try {
      const response = await api.post('/payslips/generate', { salaryId });
      toast.success('Payslip generated');
      navigate(`/admin/payslips/${response.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate payslip');
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div><h1>Salary Management</h1><p className="text-secondary">Create, review, pay, and generate payslips for salary records.</p></div>
        <button className="btn btn-primary" onClick={openCreateModal}>Create Salary Record</button>
      </div>

      <div className="card">
        {loading ? <div className="empty-state">Loading salary records...</div> : salaries.length === 0 ? <div className="empty-state"><p className="text-secondary">No salary records found.</p></div> : <div className="table-container"><table className="table"><thead><tr><th>Employee</th><th>Month</th><th>Basic</th><th>DA</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead><tbody>{salaries.map(salary => <tr key={salary._id}><td className="font-medium">{salary.employeeId?.name || '—'}</td><td>{salary.monthName} {salary.year}</td><td>{formatMoney(salary.monthlyBasicSalary)}</td><td>{formatMoney(salary.dearnessAllowance)}</td><td>{formatMoney(salary.totalGrossPay)}</td><td>{formatMoney((salary.ssfEmployeeContribution || 0) + (salary.citAmount || 0) + (salary.taxAmount || 0))}</td><td className="font-bold">{formatMoney(salary.netPay)}</td><td><Badge type={salary.isPaid ? 'green' : 'yellow'}>{salary.isPaid ? 'Paid' : 'Pending'}</Badge></td><td><div className="flex gap-2">{!salary.isPaid && <><button className="text-accent-blue hover:underline text-sm" onClick={() => openEditModal(salary)}>Edit</button><button className="text-success hover:underline text-sm" onClick={() => markPaid(salary._id)}>Mark Paid</button></>}{salary.isPaid && <button className="text-accent-blue hover:underline text-sm" onClick={() => generatePayslip(salary._id)}>Generate Payslip</button>}</div></td></tr>)}</tbody></table></div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSalaryId ? 'Edit Salary Record' : 'Create Salary Record'}>
        <form className="flex flex-col gap-4" onSubmit={createSalary}>
          <div className="form-group"><label className="form-label">Employee</label><select name="employeeId" className="select" value={formData.employeeId} onChange={updateForm} required disabled={Boolean(editingSalaryId)}><option value="">Select Employee...</option>{employees.map(employee => <option key={employee._id} value={employee._id}>{employee.name} ({employee.employeeId || employee.email})</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Month</label><select name="month" className="select" value={formData.month} onChange={updateForm}>{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select></div><div className="form-group"><label className="form-label">Year</label><input name="year" type="number" className="input" value={formData.year} onChange={updateForm} min="2000" required /></div></div>
          <div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Pay Period Start</label><input name="payPeriodStart" type="date" className="input" value={formData.payPeriodStart} onChange={updateForm} required /></div><div className="form-group"><label className="form-label">Pay Period End</label><input name="payPeriodEnd" type="date" className="input" value={formData.payPeriodEnd} onChange={updateForm} required /></div></div>
          <div className="form-group"><label className="form-label">Specific Amount (NPR)</label><input name="specificAmount" type="number" className="input" value={formData.specificAmount} onChange={updateForm} min="0" required /></div>
          <div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Basic Salary (62.25%)</label><input className="input" value={formatMoney(basic)} readOnly /></div><div className="form-group"><label className="form-label">DA (37.75%)</label><input className="input" value={formatMoney(da)} readOnly /></div></div>
          <div className="form-group"><label className="form-label">Tax Amount (NPR)</label><input name="taxAmount" type="number" className="input" value={formData.taxAmount} onChange={updateForm} min="0" /></div>
          <div className="card" style={{ background: 'var(--bg-tertiary)', padding: '1rem' }}><div className="flex justify-between mb-1"><span>SSF Employer (20%)</span><span>{formatMoney(ssfEmployer)}</span></div><div className="flex justify-between mb-1 font-bold"><span>Total Gross</span><span>{formatMoney(gross)}</span></div><div className="flex justify-between mb-1"><span>SSF Deduction (31%)</span><span>-{formatMoney(ssfDeduction)}</span></div><div className="flex justify-between mb-1"><span>Tax</span><span>-{formatMoney(tax)}</span></div><hr /><div className="flex justify-between font-bold"><span>Net Pay</span><span>{formatMoney(netPay)}</span></div></div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Salary Record'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Salary;
