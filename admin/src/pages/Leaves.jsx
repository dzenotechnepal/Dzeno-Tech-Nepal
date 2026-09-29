import React, { useState } from 'react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

const Leaves = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);
  const [leaves] = useState([
    { id: 1, employeeName: 'Sita Sharma', type: 'Sick Leave', start: '2024-05-10', end: '2024-05-11', days: 2, reason: 'Viral Fever', status: 'Pending' },
    { id: 2, employeeName: 'Ram Thapa', type: 'Annual Leave', start: '2024-05-15', end: '2024-05-20', days: 5, reason: 'Family trip', status: 'Approved' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Leave Management</h1>
        <button className="btn btn-primary">Apply Leave</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
                  <td className="font-medium">{leave.employeeName}</td>
                  <td>{leave.type}</td>
                  <td>{leave.start}</td>
                  <td>{leave.end}</td>
                  <td>{leave.days}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <Badge type={leave.status === 'Approved' ? 'green' : leave.status === 'Pending' ? 'yellow' : 'red'}>
                      {leave.status}
                    </Badge>
                  </td>
                  <td>
                    {isAdmin && leave.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button className="text-success hover:underline text-sm">Approve</button>
                        <button className="text-danger hover:underline text-sm">Reject</button>
                      </div>
                    )}
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

export default Leaves;
