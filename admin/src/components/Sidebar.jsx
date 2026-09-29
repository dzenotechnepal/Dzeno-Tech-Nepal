import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  Banknote, 
  FileText, 
  CalendarOff,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Badge from './ui/Badge';

const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white" style={{backgroundColor: '#3b82f6'}}>
          DT
        </div>
        <div className="font-bold">Dzeno Tech Nepal</div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/employees" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Employees</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/admin/employees/register" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserPlus size={20} />
            <span>Register Employee</span>
          </NavLink>
        )}
        
        <NavLink to="/admin/attendance" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/admin/salary" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Banknote size={20} />
            <span>Salary</span>
          </NavLink>
        )}
        
        <NavLink to="/admin/payslips" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Payslips</span>
        </NavLink>
        
        <NavLink to="/admin/leaves" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CalendarOff size={20} />
          <span>Leaves</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/admin/profile" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-bg-tertiary transition-colors ${isActive ? 'bg-bg-tertiary' : ''}`}>
          <UserCircle size={32} className="text-secondary" />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-sm truncate">{user?.name || 'User'}</span>
            <Badge type={isAdmin ? 'blue' : 'gray'} className="w-fit text-xs px-1.5 py-0">
              {user?.role || 'employee'}
            </Badge>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
