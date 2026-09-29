import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, RefreshCw } from 'lucide-react';
import Badge from '../components/ui/Badge';
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

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', { params: { limit: 100 } });
      setEmployees(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

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
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
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
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{emp.employeeId || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{emp.name}</td>
                    <td>{emp.designation || '—'}</td>
                    <td>{emp.department || '—'}</td>
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
    </div>
  );
};

export default Employees;
