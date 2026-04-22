import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('student_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('student_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student_user');
  };

  const updateContextUser = (updatedData) => {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('student_user', JSON.stringify(newUser));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateContextUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
