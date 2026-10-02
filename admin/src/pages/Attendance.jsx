import { useCallback, useEffect, useMemo, useState } from 'react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user, hasRole } = useAuth();
  const canViewTeam = hasRole(['admin', 'superadmin', 'ceo']);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!canViewTeam) return;

    api.get('/users', { params: { limit: 100 } })
      .then((response) => {
        const users = response.data.data?.users || [];
        setEmployees(users);
        setSelectedEmployeeId((current) => current || user?._id || user?.id || users[0]?._id || '');
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load employees'));
  }, [canViewTeam, user?._id, user?.id]);

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');
      const userId = user?._id || user?.id;
      const endpoint = canViewTeam && selectedEmployeeId
        ? '/attendance'
        : `/attendance/employee/${userId}`;
      const res = await api.get(endpoint, {
        params: { month, year, ...(canViewTeam && selectedEmployeeId ? { employeeId: selectedEmployeeId } : {}) },
      });
      setAttendance(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [canViewTeam, selectedEmployeeId, selectedMonth, user]);

  useEffect(() => {
    if (!((user?._id || user?.id) && (!canViewTeam || selectedEmployeeId))) return undefined;

    const timeoutId = window.setTimeout(() => {
      void loadAttendance();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [canViewTeam, loadAttendance, selectedEmployeeId, user?._id, user?.id]);

  const handleAttendanceAction = async (action) => {
    try {
      setActionLoading(true);
      await api.post(`/attendance/${action}`);
      toast.success(action === 'checkin' ? 'Checked in successfully' : 'Checked out successfully');
      await loadAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || `Unable to ${action}`);
    } finally {
      setActionLoading(false);
    }
  };

  const recordsByDate = useMemo(() => Object.fromEntries(attendance.map(record => [record.date, record])), [attendance]);
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const calendarDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = recordsByDate[today];
  const summary = attendance.reduce((result, record) => {
    if (record.status === 'present') result.present += 1;
    if (record.status === 'absent') result.absent += 1;
    if (record.status === 'half-day') result.halfDay += 1;
    result.totalHours += record.workHours || 0;
    return result;
  }, { present: 0, absent: 0, halfDay: 0, totalHours: 0 });

  const formatTime = (time) => time ? time.slice(0, 5) : '';
  const statusType = (status) => status === 'present' ? 'green' : status === 'absent' ? 'red' : 'yellow';

  return (
    <div>
      <div className="page-heading">
        <div><h1>Attendance</h1><p className="text-secondary">{canViewTeam ? 'Track attendance for a selected employee.' : 'Record and review your attendance.'}</p></div>
        <div className="flex gap-2">
          {canViewTeam && <select className="select" value={selectedEmployeeId} onChange={(event) => setSelectedEmployeeId(event.target.value)} aria-label="Select employee attendance">
            <option value="" disabled>Select employee...</option>
            {employees.map(employee => <option key={employee._id} value={employee._id}>{employee.name} ({employee.employeeId || employee.email})</option>)}
          </select>}
          <input type="month" className="input" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} />
          {!canViewTeam && !todayRecord?.checkIn && <button className="btn btn-primary" onClick={() => handleAttendanceAction('checkin')} disabled={actionLoading}>Check In</button>}
          {!canViewTeam && todayRecord?.checkIn && !todayRecord?.checkOut && <button className="btn btn-success" onClick={() => handleAttendanceAction('checkout')} disabled={actionLoading}>Check Out</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center p-4"><div className="text-secondary text-sm">Present Days</div><div className="text-2xl font-bold">{summary.present}</div></div>
        <div className="card text-center p-4"><div className="text-secondary text-sm">Half Days</div><div className="text-2xl font-bold">{summary.halfDay}</div></div>
        <div className="card text-center p-4"><div className="text-secondary text-sm">Absent Days</div><div className="text-2xl font-bold">{summary.absent}</div></div>
        <div className="card text-center p-4"><div className="text-secondary text-sm">Total Hours</div><div className="text-2xl font-bold">{summary.totalHours.toFixed(2)}h</div></div>
      </div>

      <div className="card attendance-calendar-card">
        <div className="attendance-calendar-header">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <span className={index === 0 || index === 6 ? 'weekend' : ''} key={day}>{day}</span>)}</div>
        {loading ? <div className="empty-state">Loading attendance...</div> : <div className="attendance-calendar-grid">
          {calendarDays.map((day, index) => {
            const date = day ? `${selectedMonth}-${String(day).padStart(2, '0')}` : null;
            const record = date ? recordsByDate[date] : null;
            const isWeekend = day && (new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6);
            return <div className={`attendance-day ${!day ? 'is-empty' : ''} ${isWeekend ? 'is-weekend' : ''}`} key={`${date || 'empty'}-${index}`}>
              {day && <><strong>{day}</strong>{record ? <><Badge type={statusType(record.status)}>{record.status}</Badge><small>{formatTime(record.checkIn)}{record.checkOut ? ` - ${formatTime(record.checkOut)}` : ''}</small></> : <small className="text-secondary">No record</small>}</>}
            </div>;
          })}
        </div>}
      </div>

      <div className="card attendance-records-card">
        <h3>Attendance Records</h3>
        {loading ? <p className="text-secondary">Loading records...</p> : attendance.length === 0 ? <p className="text-secondary">No attendance records found for this period.</p> : <div className="table-container"><table className="table"><thead><tr><th>Date</th>{canViewTeam && <th>Employee</th>}<th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>{attendance.map(record => <tr key={record._id}><td>{record.date}</td>{canViewTeam && <td>{record.employeeId?.name || '—'}</td>}<td>{record.checkIn || '—'}</td><td>{record.checkOut || '—'}</td><td>{record.workHours ? `${record.workHours}h` : '—'}</td><td><Badge type={statusType(record.status)}>{record.status}</Badge></td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
};

export default Attendance;
