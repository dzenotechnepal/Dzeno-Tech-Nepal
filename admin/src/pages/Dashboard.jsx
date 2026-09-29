import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, CalendarOff, Banknote, RefreshCw, ChevronRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const fmt = (n) => Number(n || 0).toLocaleString('en-NP');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Welcome back, <strong>{user?.name}</strong>!
            <span style={{ marginLeft: '8px' }}>
              <Badge type={user?.role === 'superadmin' ? 'red' : user?.role === 'admin' ? 'blue' : user?.role === 'ceo' ? 'purple' : 'green'}>
                {user?.role}
              </Badge>
            </span>
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px' }} />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={Users} color="#3b82f6" />
            <StatCard title="Present Today" value={stats?.totalPresentToday ?? 0} icon={UserCheck} color="#22c55e" />
            <StatCard title="On Leave Today" value={stats?.totalOnLeave ?? 0} icon={CalendarOff} color="#f59e0b" />
            <StatCard title="Salary Payout (Month)" value={`Rs. ${fmt(stats?.totalSalaryPayout)}`} icon={Banknote} color="#a855f7" />
          </div>


          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            {/* Recent attendance */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Recent Attendance</h3>
                <button
                  style={{ color: 'var(--accent-blue)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => navigate('/admin/attendance')}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>
              {(stats?.recentAttendance || []).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>No attendance records today</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Check In</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentAttendance || []).slice(0, 8).map(record => (
                        <tr key={record._id}>
                          <td style={{ fontWeight: 500 }}>{record.employeeId?.name || '—'}</td>
                          <td>{record.checkIn || '—'}</td>
                          <td>
                            <Badge type={
                              record.status === 'present' ? 'green' :
                              record.status === 'absent' ? 'red' :
                              record.status === 'leave' ? 'yellow' : 'gray'
                            }>
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/attendance')}>
                  📋 View Attendance
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/salary')}>
                  💰 Manage Salary
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/payslips')}>
                  🧾 Generate Payslip
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/leaves')}>
                  🌴 Manage Leaves
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/employees')}>
                  👥 All Employees
                </button>
              </div>

              {/* Recent payslips */}
              {(stats?.recentPayslips || []).length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '14px' }}>Recent Payslips</h3>
                  {stats.recentPayslips.slice(0, 3).map(p => (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/admin/payslips/${p._id}`)}
                      style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer', background: 'var(--bg-tertiary)', marginBottom: '6px', fontSize: '13px' }}
                    >
                      <strong>{p.payslipNumber}</strong>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{p.monthName} {p.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
