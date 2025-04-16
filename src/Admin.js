import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  console.log('Rendering Admin component, isLoggedIn:', isLoggedIn, 'username:', username, 'error:', error);

  const handleLogin = async () => {
    console.log('handleLogin called, username:', username, 'password:', password);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, setting isLoggedIn to true');
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <p>Logged in successfully!</p>
      </div>
    );
  }

  console.log('Rendering login form, error:', error, 'username:', username);
  return (
    <div className="admin-login-container">
      <h2 className="text-center mb-4">Admin Login</h2>
      <div className="admin-login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username || ''}
            onChange={(e) => {
              const newValue = e?.target?.value ?? '';
              console.log('Username input changed, new value:', newValue);
              setUsername(newValue);
            }}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password || ''}
            onChange={(e) => {
              const newValue = e?.target?.value ?? '';
              console.log('Password input changed, new value:', newValue);
              setPassword(newValue);
            }}
            className="form-control"
            required
          />
        </div>
        {error && <p className="text-danger text-center">{error}</p>}
        <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
      </div>
    </div>
  );
};

export default Admin;
