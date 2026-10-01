import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import RegisterEmployee from './pages/RegisterEmployee';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import Payslips from './pages/Payslips';
import PayslipView from './pages/PayslipView';
import Leaves from './pages/Leaves';
import Profile from './pages/Profile';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Holidays from './pages/Holidays';
import Settings from './pages/Settings';
import Contracts from './pages/Contracts';
import Submissions from './pages/Submissions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            
            <Route path="/admin/employees" element={<Employees />} />
            
            {/* Admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
              <Route path="/admin/employees/register" element={<RegisterEmployee />} />
              <Route path="/admin/salary" element={<Salary />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/holidays" element={<Holidays />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/submissions" element={<Submissions />} />
            </Route>
            
            <Route path="/admin/employees/:id" element={<EmployeeDetail />} />
            <Route path="/admin/attendance" element={<Attendance />} />
            <Route path="/admin/payslips" element={<Payslips />} />
            <Route path="/admin/payslips/:id" element={<PayslipView />} />
            <Route path="/admin/leaves" element={<Leaves />} />
            <Route path="/admin/contracts" element={<Contracts />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      }}/>
    </AuthProvider>
  );
}

export default App;
