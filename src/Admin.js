import React, { useState } from 'react';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  console.log('Rendering Admin component, username:', username, 'password:', password);

  return (
    <div>
      <h2>Admin Login (Minimal + Password)</h2>
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
      </div>
    </div>
  );
};

export default Admin;
