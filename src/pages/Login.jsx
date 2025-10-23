import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://nm2599bc-5000.inc1.devtunnels.ms/';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);
    try {
      const url = `${API_BASE}/api/${mode}`;
      const res = await axios.post(url, { username, password });
      if (res.data.token) {
        onLogin(res.data.token);
        navigate('/'); // redirect after successful login/register
      } else {
        setError(res.data.error || 'Unexpected response');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="auth-page">
      <h2 className="auth-title">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="sr-only">Username</label>
        <input
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="sr-only">Password</label>
        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="auth-actions">
          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create Account' : 'Have Account?'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
