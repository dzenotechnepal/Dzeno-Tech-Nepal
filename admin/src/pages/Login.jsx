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
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data.user, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-logo" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '12px',
            background: '#3b82f6', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '800', color: '#fff',
            fontSize: '22px', margin: '0 auto 12px',
          }}>
            8B
          </div>
          <h2 style={{ margin: 0 }}>Eight Bit Pvt. Ltd.</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '14px' }}>
            Company Operations Portal
          </p>
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
              placeholder="superadmin@eightbit.com.np"
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Default superadmin: superadmin@eightbit.com.np
        </p>
      </div>
    </div>
  );
};

export default Login;
