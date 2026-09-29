import React, { useState, useEffect } from 'react';
import { Users, UserCheck, CalendarOff, Banknote } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    salaryPayout: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data fetching
        setTimeout(() => {
          setStats({
            totalEmployees: 42,
            presentToday: 38,
            onLeave: 2,
            salaryPayout: 1250000
          });
          setRecentAttendance([
            { id: 1, name: 'Sujan Aryal', time: '09:05 AM', status: 'Present' },
            { id: 2, name: 'Ram Thapa', time: '09:15 AM', status: 'Late' },
            { id: 3, name: 'Sita Sharma', time: '-', status: 'On Leave' },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1>Dashboard</h1>
        <p className="text-secondary">Welcome back, {user?.name}! You are logged in as <span className="font-semibold">{user?.role}</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} colorClass="text-blue-500" />
        <StatCard title="Present Today" value={stats.presentToday} icon={UserCheck} colorClass="text-green-500" />
        <StatCard title="On Leave" value={stats.onLeave} icon={CalendarOff} colorClass="text-yellow-500" />
        <StatCard title="Salary Payout (This Month)" value={`Rs. ${stats.salaryPayout.toLocaleString()}`} icon={Banknote} colorClass="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="mb-4">Recent Attendance</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check In Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map(record => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.name}</td>
                    <td>{record.time}</td>
                    <td>
                      <Badge type={
                        record.status === 'Present' ? 'green' : 
                        record.status === 'Late' ? 'yellow' : 'red'
                      }>
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button className="btn btn-outline justify-start w-full">Mark My Attendance</button>
            <button className="btn btn-outline justify-start w-full">Apply for Leave</button>
            <button className="btn btn-outline justify-start w-full">View Payslips</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
