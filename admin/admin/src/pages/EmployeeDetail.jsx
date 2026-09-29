import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);
  
  const [activeTab, setActiveTab] = useState('info');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEmployee({
        id: id,
        name: 'Sujan Aryal',
        email: 'sujan@eightbit.com',
        phone: '9841234567',
        address: 'Lalitpur, Nepal',
        panNumber: '108100862',
        designation: 'Software Dev',
        department: 'Engineering',
        role: 'admin',
        joiningDate: '2022-01-15',
        status: 'Active',
        bank: {
          bankName: 'Nabil Bank',
          accountNumber: '12345678901234',
          branch: 'Kupondole',
          ifsc: 'NABIL01'
        },
        salary: {
          basic: 21000,
          da: 14000
        }
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="flex justify-center mt-20"><div className="spinner"></div></div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-outline mb-4">
          <ArrowLeft size={16} /> Back to Employees
        </button>
        
        <div className="card flex justify-between items-start">
          <div>
            <h1 className="mb-2">{employee.name}</h1>
            <div className="flex gap-3 items-center text-secondary mb-4">
              <span>{employee.id}</span> • 
              <span>{employee.designation}</span> • 
              <span>{employee.department}</span>
            </div>
            <div className="flex gap-2">
              <Badge type={employee.role === 'admin' ? 'blue' : 'gray'}>{employee.role.toUpperCase()}</Badge>
              <Badge type={employee.status === 'Active' ? 'green' : 'yellow'}>{employee.status}</Badge>
            </div>
          </div>
          {isAdmin && (
            <button className="btn btn-outline">
              <Edit size={16} /> Edit Employee
            </button>
          )}
        </div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Personal Info</button>
        <button className={`tab-btn ${activeTab === 'bank' ? 'active' : ''}`} onClick={() => setActiveTab('bank')}>Bank Details</button>
        <button className={`tab-btn ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => setActiveTab('salary')}>Salary</button>
      </div>

      <div className="card">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-secondary text-sm">Email Address</p>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-secondary text-sm">Phone Number</p>
              <p className="font-medium">{employee.phone}</p>
            </div>
            <div>
              <p className="text-secondary text-sm">Address</p>
              <p className="font-medium">{employee.address}</p>
            </div>
            <div>
              <p className="text-secondary text-sm">PAN Number</p>
              <p className="font-medium">{employee.panNumber}</p>
            </div>
            <div>
              <p className="text-secondary text-sm">Joining Date</p>
              <p className="font-medium">{employee.joiningDate}</p>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-secondary text-sm">Bank Name</p>
                <p className="font-medium">{employee.bank.bankName}</p>
              </div>
              <div>
                <p className="text-secondary text-sm">Account Number</p>
                <p className="font-medium">{employee.bank.accountNumber}</p>
              </div>
              <div>
                <p className="text-secondary text-sm">Branch</p>
                <p className="font-medium">{employee.bank.branch}</p>
              </div>
              <div>
                <p className="text-secondary text-sm">Routing/IFSC</p>
                <p className="font-medium">{employee.bank.ifsc}</p>
              </div>
            </div>
            {isAdmin && (
              <button className="btn btn-outline text-sm mt-4">Edit Bank Details</button>
            )}
          </div>
        )}

        {activeTab === 'salary' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-secondary text-sm">Monthly Basic Salary</p>
                <p className="font-medium text-lg">NPR {employee.salary.basic.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-secondary text-sm">Dearness Allowance</p>
                <p className="font-medium text-lg">NPR {employee.salary.da.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
