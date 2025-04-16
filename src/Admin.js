import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [username, setUsername] = useState('');

  console.log('Rendering Admin component, username:', username);

  return (
    <div>
      <h2>Admin Login (Minimal)</h2>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username || ''}
          onChange={(e) => {
            try {
              const newValue = e?.target?.value ?? '';
              console.log('Username input changed, new value:', newValue);
              setUsername(newValue);
            } catch (err) {
              console.error('Error in username onChange:', err);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Admin;
