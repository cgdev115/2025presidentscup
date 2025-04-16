import React, { useState } from 'react';

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
            const newValue = e?.target?.value ?? '';
            console.log('Username input changed, new value:', newValue);
            setUsername(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default Admin;
