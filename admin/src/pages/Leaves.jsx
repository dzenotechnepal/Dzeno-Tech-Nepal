import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { leaveType: 'annual', startDate: '', endDate: '', reason: '' };
const leaveTypes = ['annual', 'sick', 'maternity', 'paternity', 'unpaid'];

const Leaves = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin', 'ceo']);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leave');
      setLeaves(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [user?._id, user?.id]);

  const updateForm = (event) =>
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const openApply = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const daysBetween = () => {
    if (!form.startDate || !form.endDate) return 0;
    return Math.floor((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1;
  };

  const applyLeave = async (event) => {
    event.preventDefault();
    const totalDays = daysBetween();
    if (totalDays < 1) {
      toast.error('End date must be on or after start date');
      return;
    }
    try {
      setSaving(true);
      await api.post('/leave/apply', { ...form, totalDays });
      toast.success('Leave application submitted');
      setIsModalOpen(false);
      await loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply leave');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (leaveId, nextStatus) => {
    try {
      await api.put(`/leave/${leaveId}/${nextStatus}`);
      toast.success(`Leave ${nextStatus === 'approve' ? 'approved' : 'rejected'}`);
      await loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${nextStatus} leave`);
    }
  };

  const cancelLeave = async (leave) => {
    if (!window.confirm('Cancel this leave application?')) return;
    try {
      await api.delete(`/leave/${leave._id}`);
      toast.success('Leave cancelled');
      await loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr).slice(0, 10);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateStr).slice(0, 10);
    }
  };

  const statusType = (status) =>
    status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'yellow';

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const empName = l.employeeId?.name?.toLowerCase() || '';
        const empCode = l.employeeId?.employeeId?.toLowerCase() || '';
        const reason = l.reason?.toLowerCase() || '';
        const type = l.leaveType?.toLowerCase() || '';
        if (!empName.includes(term) && !empCode.includes(term) && !reason.includes(term) && !type.includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [leaves, statusFilter, searchTerm]);

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Leave Management</h1>
          <p className="text-secondary">Apply, review, approve, and track leave requests.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={loadLeaves} disabled={loading} title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openApply}>
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      <div className="card customer-filters mb-4">
        <div className="customer-search">
          <Search size={16} className="customer-search-icon" />
          <input
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee, type, or reason..."
          />
        </div>
        <select
          className="select customer-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">Loading leave records...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="empty-state">
            <CalendarOff size={36} className="text-secondary" />
            <h3>No leave records found</h3>
            <p className="text-secondary">
              {leaves.length > 0
                ? 'No leaves match your filter criteria.'
                : 'Apply for leave to create the first record.'}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id}>
                    {isAdmin && (
                      <td className="font-medium">
                        {leave.employeeId?.name || '—'}
                        {leave.employeeId?.employeeId && (
                          <span className="text-secondary text-xs block">
                            {leave.employeeId.employeeId}
                          </span>
                        )}
                      </td>
                    )}
                    <td style={{ textTransform: 'capitalize' }}>{leave.leaveType}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{leave.totalDays}</td>
                    <td style={{ maxWidth: '240px' }} title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td>
                      <Badge type={statusType(leave.status)}>{leave.status}</Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {isAdmin && leave.status === 'pending' && (
                          <>
                            <button
                              className="text-success hover:underline text-sm font-medium"
                              onClick={() => updateStatus(leave._id, 'approve')}
                            >
                              Approve
                            </button>
                            <button
                              className="text-danger hover:underline text-sm font-medium"
                              onClick={() => updateStatus(leave._id, 'reject')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(leave.status === 'pending' || isAdmin) && (
                          <button
                            className="btn btn-outline text-xs"
                            onClick={() => cancelLeave(leave)}
                            title="Cancel Leave"
                          >
                            <Trash2 size={13} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply Leave">
        <form className="flex flex-col gap-4" onSubmit={applyLeave}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              className="select"
              name="leaveType"
              value={form.leaveType}
              onChange={updateForm}
            >
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                className="input"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={updateForm}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                className="input"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={updateForm}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason *</label>
            <textarea
              className="input"
              name="reason"
              value={form.reason}
              onChange={updateForm}
              rows="4"
              placeholder="Provide a reason for the leave request..."
              required
            />
          </div>
          <p className="text-secondary text-sm">Total days: {daysBetween() || '—'}</p>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? 'Submitting...' : 'Submit Leave'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
