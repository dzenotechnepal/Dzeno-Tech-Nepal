import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Search, Plus, RefreshCw } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ROLES = ['superadmin', 'admin', 'ceo', 'developer', 'employee'];

const Employees = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', { params: { limit: 100 } });
      const data = res.data.data;
      setEmployees(Array.isArray(data) ? data : data?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const openEmailModal = async () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one user first');
      return;
    }
    try {
      const response = await api.get('/email/status');
      setEmailStatus(response.data.data);
    } catch (err) {
      setEmailStatus({ configured: false });
    }
    setEmailModalOpen(true);
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    try {
      setSendingEmail(true);
      const response = await api.post('/email/send', { userIds: selectedIds, ...emailForm });
      toast.success(`Email sent to ${response.data.data.recipientCount} user(s)`);
      setEmailModalOpen(false);
      setEmailForm({ subject: '', message: '' });
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const toggleSelected = (id) => setSelectedIds(previous => previous.includes(id) ? previous.filter(selectedId => selectedId !== id) : [...previous, id]);

  const filtered = employees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadgeType = (role) => {
    const map = { superadmin: 'red', admin: 'blue', ceo: 'purple', developer: 'green', employee: 'gray' };
    return map[role] || 'gray';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Employees</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={fetchEmployees} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-outline" onClick={openEmailModal} disabled={selectedIds.length === 0}>
            <Mail size={16} /> Email Selected ({selectedIds.length})
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/admin/employees/register')}>
              <Plus size={16} /> Register Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="select" style={{ width: '160px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            {employees.length === 0 ? 'No employees found. Register the first employee!' : 'No results match your search.'}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr
                    key={emp._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/employees/${emp._id}`)}
                  >
                    <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(emp._id)} onChange={() => toggleSelected(emp._id)} aria-label={`Select ${emp.name}`} /></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{emp.employeeId || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{emp.name}</td>
                    <td>{emp.designation || '—'}</td>
                    <td>{emp.department || '—'}</td>
                    <td>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-NP') : '—'}</td>
                    <td><Badge type={roleBadgeType(emp.role)}>{emp.role}</Badge></td>
                    <td>
                      <Badge type={emp.isActive ? 'green' : 'red'}>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <button
                        style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/employees/${emp._id}`); }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '13px' }}>
              Showing {filtered.length} of {employees.length} employees
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Email Company Users">
        <form className="flex flex-col gap-4" onSubmit={sendEmail}>
          <p className="text-secondary text-sm">Recipients: {selectedIds.length} selected company user(s).</p>
          {emailStatus && !emailStatus.configured && <p className="text-danger text-sm">Email service is not configured on the server.</p>}
          <div className="form-group"><label className="form-label">Subject</label><input className="input" value={emailForm.subject} onChange={(e) => setEmailForm(previous => ({ ...previous, subject: e.target.value }))} required /></div>
          <div className="form-group"><label className="form-label">Message</label><textarea className="input" rows="8" value={emailForm.message} onChange={(e) => setEmailForm(previous => ({ ...previous, message: e.target.value }))} required /></div>
          <button type="submit" className="btn btn-primary w-full" disabled={sendingEmail || emailStatus?.configured === false}>{sendingEmail ? 'Sending...' : 'Send Email'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
