import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="flex items-center gap-4">
            <button onClick={logout} className="btn btn-outline text-sm">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
