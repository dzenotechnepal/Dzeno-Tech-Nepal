import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

const Employees = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);
  
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API
    setTimeout(() => {
      setEmployees([
        { id: 'EMP001', name: 'Sujan Aryal', designation: 'Software Dev', role: 'admin', department: 'Engineering', status: 'Active' },
        { id: 'EMP002', name: 'Ram Thapa', designation: 'UI/UX Designer', role: 'employee', department: 'Design', status: 'Active' },
        { id: 'EMP003', name: 'Sita Sharma', designation: 'QA Engineer', role: 'employee', department: 'QA', status: 'On Leave' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Employees</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/admin/employees/register')}>
            <Plus size={16} /> Register Employee
          </button>
        )}
      </div>

      <div className="card mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-2.5 text-secondary" />
          <input 
            type="text" 
            className="input" 
            style={{paddingLeft: '2.5rem'}} 
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="select w-48" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center p-8"><div className="spinner"></div></div>
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
                  <tr key={emp.id} className="cursor-pointer" onClick={() => navigate(`/admin/employees/${emp.id}`)}>
                    <td>{emp.id}</td>
                    <td className="font-medium">{emp.name}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.department}</td>
                    <td>
                      <Badge type={emp.role === 'admin' ? 'blue' : 'gray'}>{emp.role}</Badge>
                    </td>
                    <td>
                      <Badge type={emp.status === 'Active' ? 'green' : 'yellow'}>{emp.status}</Badge>
                    </td>
                    <td>
                      <button className="text-accent-blue hover:underline" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/employees/${emp.id}`);
                      }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
