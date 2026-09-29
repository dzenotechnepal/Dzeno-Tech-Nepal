import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('dzenotech_user');
      const token = localStorage.getItem('dzenotech_token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('dzenotech_user');
          localStorage.removeItem('dzenotech_token');
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('dzenotech_token', token);
    localStorage.setItem('dzenotech_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('dzenotech_token');
    localStorage.removeItem('dzenotech_user');
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
