import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('username', email); // OAuth2 expects username
      params.append('password', password);

      // First wait for API success, then navigation
      const [response] = await Promise.all([
        api.post('/auth/access-token', params).then(res => res.data),
        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }),
      ]);

      login(response.access_token);

      // Then wait for navigation to complete
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 429) {
        setError('Too many failed login attempts. Please try again in 1 minute.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h2>
        {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-4">Login</Button>
        </form>
      </div>
    </div>
  );
};