import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Building2, CreditCard, Clock, DollarSign, FileText, Calendar } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'info', label: 'Info', icon: '👤' },
  { id: 'bank', label: 'Bank Details', icon: '🏦' },
  { id: 'attendance', label: 'Attendance', icon: '📋' },
  { id: 'salary', label: 'Salary', icon: '💰' },
  { id: 'payslips', label: 'Payslips', icon: '🧾' },
  { id: 'leaves', label: 'Leaves', icon: '🌴' },
];

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);

  const [activeTab, setActiveTab] = useState('info');
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (employee) loadTabData(activeTab);
  }, [activeTab, employee]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      setEmployee(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    setTabLoading(true);
    try {
      if (tab === 'attendance') {
        const res = await api.get(`/attendance/employee/${id}`);
        setAttendance(res.data.data || []);
      } else if (tab === 'salary') {
        const res = await api.get(`/salary/employee/${id}`);
        setSalary(res.data.data || []);
      } else if (tab === 'payslips') {
        const res = await api.get(`/payslips/employee/${id}`);
        setPayslips(res.data.data || []);
      } else if (tab === 'leaves') {
        const res = await api.get(`/leave/employee/${id}`);
        setLeaves(res.data.data || []);
      }
    } catch (err) {
      // silently ignore tab-level errors
    } finally {
      setTabLoading(false);
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-NP') : '—';
  const fmt = (n) => Number(n || 0).toLocaleString('en-NP');

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
      <div className="spinner" style={{ width: '32px', height: '32px' }} />
    </div>
  );
  if (!employee) return (
    <div style={{ textAlign: 'center', padding: '48px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Employee not found.</p>
      <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: '16px' }}>Go Back</button>
    </div>
  );

  const roleBadgeType = (role) => ({ superadmin: 'red', admin: 'blue', ceo: 'purple', developer: 'green', employee: 'gray' })[role] || 'gray';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}><ArrowLeft size={16} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{employee.name}</h1>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'monospace' }}>{employee.employeeId}</span>
            <Badge type={roleBadgeType(employee.role)}>{employee.role}</Badge>
            <Badge type={employee.isActive ? 'green' : 'red'}>{employee.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
              whiteSpace: 'nowrap', fontWeight: activeTab === tab.id ? '600' : '400',
              marginBottom: '-1px',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {tabLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><div className="spinner" /></div>
      ) : (
        <>
          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>👤 Personal Information</h3>
                {[
                  ['Full Name', employee.name],
                  ['Email', employee.email],
                  ['Phone', employee.phone || '—'],
                  ['Gender', employee.gender || '—'],
                  ['Age', employee.age || '—'],
                  ['Citizenship Number', employee.citizenshipNumber || '—'],
                  ['Address', employee.address || '—'],
                  ['PAN Number', employee.panNumber || '—'],
                  ['Joining Date', fmtDate(employee.joiningDate)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>🏢 Work Information</h3>
                {[
                  ['Designation', employee.designation || '—'],
                  ['Department', employee.department || '—'],
                  ['Role', employee.role],
                  ['Employee ID', employee.employeeId || '—'],
                  ['Status', employee.isActive ? 'Active' : 'Inactive'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANK TAB */}
          {activeTab === 'bank' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>🏦 Bank Information</h3>
              {employee.bankAccountNumber ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    ['Bank Name', employee.bankName],
                    ['Account Holder Name', employee.bankAccountHolderName],
                    ['Account Number', employee.bankAccountNumber],
                    ['Branch', employee.bankBranch],
                    ['SSF Enrollment', employee.ssfEnrolled ? 'Enrolled' : 'Not enrolled'],
                  ].map(([label, value]) => (
                    <div key={label} className="card" style={{ background: 'var(--bg-tertiary)', padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontWeight: '600', fontFamily: label.includes('Account') ? 'monospace' : undefined }}>
                        {value || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No bank information on file.</p>
              )}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>📋 Attendance History</h3>
              {attendance.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No attendance records found.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
                    <tbody>
                      {attendance.map(a => (
                        <tr key={a._id}>
                          <td>{fmtDate(a.date)}</td>
                          <td>{a.checkIn || '—'}</td>
                          <td>{a.checkOut || '—'}</td>
                          <td>{a.workHours ? `${a.workHours}h` : '—'}</td>
                          <td><Badge type={a.status === 'present' ? 'green' : a.status === 'absent' ? 'red' : 'yellow'}>{a.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SALARY TAB */}
          {activeTab === 'salary' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>💰 Salary History</h3>
              {salary.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No salary records found.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead><tr><th>Month/Year</th><th>Basic</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead>
                    <tbody>
                      {salary.map(s => (
                        <tr key={s._id}>
                          <td>{s.monthName} {s.year}</td>
                          <td>Rs. {fmt(s.monthlyBasicSalary)}</td>
                          <td>Rs. {fmt(s.totalGrossPay)}</td>
                          <td style={{ color: 'var(--danger)' }}>Rs. {fmt((s.ssfEmployeeDeduction || 0) + (s.citAmount || 0))}</td>
                          <td style={{ fontWeight: '700', color: 'var(--success)' }}>Rs. {fmt(s.netPay)}</td>
                          <td><Badge type={s.isPaid ? 'green' : 'yellow'}>{s.isPaid ? 'Paid' : 'Pending'}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PAYSLIPS TAB */}
          {activeTab === 'payslips' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>🧾 Payslips</h3>
              {payslips.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No payslips generated yet.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead><tr><th>Payslip No.</th><th>Month/Year</th><th>Net Pay</th><th>Actions</th></tr></thead>
                    <tbody>
                      {payslips.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{p.payslipNumber}</td>
                          <td>{p.monthName} {p.year}</td>
                          <td style={{ fontWeight: '600', color: 'var(--success)' }}>Rs. {fmt(p.salaryId?.netPay)}</td>
                          <td>
                            <button
                              style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
                              onClick={() => navigate(`/admin/payslips/${p._id}`)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LEAVES TAB */}
          {activeTab === 'leaves' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>🌴 Leave History</h3>
              {leaves.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No leave records found.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
                    <tbody>
                      {leaves.map(l => (
                        <tr key={l._id}>
                          <td style={{ textTransform: 'capitalize' }}>{l.leaveType}</td>
                          <td>{fmtDate(l.startDate)}</td>
                          <td>{fmtDate(l.endDate)}</td>
                          <td>{l.totalDays}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason || '—'}</td>
                          <td><Badge type={l.status === 'approved' ? 'green' : l.status === 'rejected' ? 'red' : 'yellow'}>{l.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeDetail;
