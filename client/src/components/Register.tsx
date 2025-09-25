import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types';

interface RegisterProps {
  setUser: (user: User) => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
  const [formData, setFormData] = useState<RegisterFormData>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post<{ token: string; user: User }>('/api/register', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} data-testid="register-form">
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          data-testid="name-input"
        />
      </div>
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          data-testid="email-input"
        />
      </div>
      
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          data-testid="password-input"
        />
      </div>
      
      <button type="submit" className="btn btn-primary" data-testid="register-button">
        Register
      </button>
    </form>
  );
};

export default Register;