import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you'd call the API:
      // const res = await api.post('/auth/login', { email, password });
      // login(res.data.user, res.data.token);
      
      // Mocking login for UI creation:
      setTimeout(() => {
        login(
          { id: 1, name: 'Admin User', email, role: 'admin' }, 
          'dummy-jwt-token'
        );
        toast.success('Logged in successfully');
        navigate('/admin/dashboard');
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-logo text-center flex-col items-center gap-2">
          <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xl mx-auto" style={{backgroundColor: '#3b82f6'}}>
            8B
          </div>
          <h2 className="mt-2 mb-0">Eight Bit Pvt. Ltd.</h2>
          <p className="text-secondary text-sm">Admin Portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@eightbit.com"
            />
          </div>
          
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
