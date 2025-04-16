import React, { useState } from 'react';

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
    <div>
      <h2>Admin Login (Minimal + Password + Submit)</h2>
      <div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username || ''}
            onChange={(e) => {
              const newValue = e?.target?.value ?? '';
              console.log('Username input changed, new value:', newValue);
              setUsername(newValue);
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password || ''}
            onChange={(e) => {
              const newValue = e?.target?.value ?? '';
              console.log('Password input changed, new value:', newValue);
              setPassword(newValue);
            }}
          />
        </div>
        {error && <p>{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Admin;
