import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ROLES = ['employee', 'developer', 'ceo', 'admin', 'superadmin'];
const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Management', 'HR', 'Finance', 'Sales', 'Operations'];

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    designation: '', department: '', role: 'employee',
    panNumber: '', joiningDate: '', password: '',
    bankName: '', bankAccountNumber: '', bankBranch: '', bankIFSC: '',
    basicSalary: '', dearnessAllowance: '',
  });

  // Live salary preview
  const basic = parseFloat(formData.basicSalary) || 0;
  const da = parseFloat(formData.dearnessAllowance) || 0;
  const ssfEmployer = parseFloat((basic * 0.20).toFixed(2));
  const totalGross = parseFloat((basic + da + ssfEmployer).toFixed(2));
  const ssfDeduction = parseFloat((basic * 0.31).toFixed(2));
  const netPay = parseFloat((totalGross - ssfDeduction).toFixed(2));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        designation: formData.designation,
        department: formData.department,
        phone: formData.phone,
        address: formData.address,
        panNumber: formData.panNumber,
        joiningDate: formData.joiningDate || undefined,
        bankName: formData.bankName || undefined,
        bankAccountNumber: formData.bankAccountNumber || undefined,
        bankBranch: formData.bankBranch || undefined,
        bankIFSC: formData.bankIFSC || undefined,
      };

      const res = await api.post('/users/register', payload);
      toast.success(`Employee ${res.data.data?.name || ''} registered! ID: ${res.data.data?.employeeId}`);
      navigate('/admin/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const sectionTitle = (n, t) => (
    <h3 style={{ margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-blue)' }}>
      {n}. {t}
    </h3>
  );

  const field = (label, child, required = false) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      {child}
    </div>
  );

  const inp = (name, type = 'text', placeholder = '', req = false) => (
    <input type={type} name={name} className="input" value={formData[name]}
      onChange={handleChange} placeholder={placeholder} required={req} />
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ margin: 0 }}>Register New Employee</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Personal */}
        <div className="card" style={{ marginBottom: '16px' }}>
          {sectionTitle(1, 'Personal & Job Information')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {field('Full Name', inp('name', 'text', 'Sujan Aryal', true), true)}
            {field('Email Address', inp('email', 'email', 'sujan@dzenotech.com.np', true), true)}
            {field('Password', inp('password', 'password', 'Set initial password', true), true)}
            {field('Phone Number', inp('phone', 'tel', '+977-98XXXXXXXX'))}
            {field('PAN Number', inp('panNumber', 'text', '108100862'))}
            {field('Joining Date', inp('joiningDate', 'date'))}
            {field('Designation', inp('designation', 'text', 'Software Developer', true), true)}
            {field('Department',
              <select name="department" className="select" value={formData.department} onChange={handleChange}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
            {field('System Role',
              <select name="role" className="select" value={formData.role} onChange={handleChange} required>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            , true)}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input type="text" name="address" className="input" value={formData.address}
                onChange={handleChange} placeholder="Lalitpur, Nepal" />
            </div>
          </div>
        </div>

        {/* Section 2: Bank */}
        <div className="card" style={{ marginBottom: '16px' }}>
          {sectionTitle(2, 'Bank Information')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {field('Bank Name', inp('bankName', 'text', 'Nepal Investment Bank'))}
            {field('Account Number', inp('bankAccountNumber', 'text', 'XXXXXXXXXXXX'))}
            {field('Branch', inp('bankBranch', 'text', 'Lalitpur Branch'))}
            {field('IFSC / Routing Code', inp('bankIFSC', 'text', 'NIBPNPKA'))}
          </div>
        </div>

        {/* Section 3: Salary Preview */}
        <div className="card" style={{ marginBottom: '16px' }}>
          {sectionTitle(3, 'Salary Details (Nepal SSF Preview)')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {field('Monthly Basic Salary (NPR)', inp('basicSalary', 'number', '21000'))}
            {field('Dearness Allowance (DA) (NPR)', inp('dearnessAllowance', 'number', '14000'))}
          </div>

          {basic > 0 && (
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '16px', fontSize: '14px' }}>
              <div style={{ fontWeight: '600', marginBottom: '10px', color: 'var(--accent-blue)' }}>
                📊 Salary Breakdown Preview
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                {[
                  ['Basic Salary', `NPR ${basic.toLocaleString()}`],
                  ['Dearness Allowance', `NPR ${da.toLocaleString()}`],
                  ['SSF Employer (20%)', `+ NPR ${ssfEmployer.toLocaleString()}`],
                  ['Total Gross Pay', `NPR ${totalGross.toLocaleString()}`],
                  ['SSF Deduction (31%)', `− NPR ${ssfDeduction.toLocaleString()}`],
                  ['Net Pay', `NPR ${netPay.toLocaleString()}`],
                ].map(([label, value], i) => (
                  <React.Fragment key={i}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: i === 3 || i === 5 ? '700' : '400', color: i === 5 ? 'var(--success)' : undefined }}>
                      {value}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                * Salary record will need to be created separately from the Salary page for each month.
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" /> : '✓ Register Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterEmployee;
