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
  UserCircle,
  UsersRound,
  Package,
  CalendarDays,
  Settings,
  FileSignature,
  Inbox
  ,BriefcaseBusiness
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Badge from './ui/Badge';

const Sidebar = ({ onNavigate }) => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Dzeno Tech Nepal" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        <NavLink onClick={onNavigate} to="/admin/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink onClick={onNavigate} to="/admin/employees" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Employees</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink onClick={onNavigate} to="/admin/employees/register" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserPlus size={20} />
            <span>Register Employee</span>
          </NavLink>
        )}
        
        <NavLink onClick={onNavigate} to="/admin/attendance" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink onClick={onNavigate} to="/admin/salary" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Banknote size={20} />
            <span>Salary</span>
          </NavLink>
        )}

        {isAdmin ? (
          <>
            <NavLink onClick={onNavigate} to="/admin/customers" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UsersRound size={20} />
              <span>Customers</span>
            </NavLink>
            <NavLink onClick={onNavigate} to="/admin/products" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Package size={20} />
              <span>Products</span>
            </NavLink>
            <NavLink onClick={onNavigate} to="/admin/holidays" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarDays size={20} />
              <span>Holidays</span>
            </NavLink>
            <NavLink onClick={onNavigate} to="/admin/submissions" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Inbox size={20} />
              <span>Submissions</span>
            </NavLink>
            <NavLink onClick={onNavigate} to="/admin/openings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BriefcaseBusiness size={20} />
              <span>Open Positions</span>
            </NavLink>
          </>
        ) : null}

        <NavLink onClick={onNavigate} to="/admin/contracts" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileSignature size={20} />
          <span>Contracts</span>
        </NavLink>
        
        <NavLink onClick={onNavigate} to="/admin/payslips" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Payslips</span>
        </NavLink>
        
        <NavLink onClick={onNavigate} to="/admin/leaves" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CalendarOff size={20} />
          <span>Leaves</span>
        </NavLink>

        {isAdmin && (
          <NavLink onClick={onNavigate} to="/admin/settings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        )}
      </nav>
      
      <div className="sidebar-footer">
        <NavLink onClick={onNavigate} to="/admin/profile" className={({isActive}) => `flex items-center gap-3 p-2 rounded hover:bg-bg-tertiary transition-colors ${isActive ? 'bg-bg-tertiary' : ''}`}>
          {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} /> : <UserCircle size={32} className="text-secondary" />}
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
