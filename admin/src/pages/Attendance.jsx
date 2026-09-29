import React, { useState } from 'react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

const Attendance = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);
  
  const [attendance] = useState([
    { id: 1, date: '2024-04-30', employeeName: 'Sujan Aryal', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 5m', status: 'Present' },
    { id: 2, date: '2024-04-30', employeeName: 'Ram Thapa', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8h 45m', status: 'Late' },
    { id: 3, date: '2024-04-29', employeeName: 'Sujan Aryal', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 0m', status: 'Present' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Attendance</h1>
        <div className="flex gap-4">
          <input type="month" className="input" defaultValue="2024-04" />
          {isAdmin && <button className="btn btn-primary">Mark Attendance</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center p-4">
          <div className="text-secondary text-sm">Present Days</div>
          <div className="text-2xl font-bold text-green-500">22</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-secondary text-sm">Late Days</div>
          <div className="text-2xl font-bold text-yellow-500">3</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-secondary text-sm">Absent Days</div>
          <div className="text-2xl font-bold text-red-500">1</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-secondary text-sm">Total Hours</div>
          <div className="text-2xl font-bold text-blue-500">185h</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td className="font-medium">{record.employeeName}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>{record.hours}</td>
                  <td>
                    <Badge type={record.status === 'Present' ? 'green' : record.status === 'Late' ? 'yellow' : 'red'}>
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
