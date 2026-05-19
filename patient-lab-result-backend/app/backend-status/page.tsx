'use client';

import { useEffect, useState } from 'react';

export default function BackendStatus() {
  const [status, setStatus] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Check health
    fetch('/api/health').then(r => r.json()).then(setStatus);
    // Get users
    fetch('/api/users').then(r => r.json()).then(data => setUsers(data.users || []));
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔧 Backend Status Dashboard</h1>
      
      <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2>✅ Server Status</h2>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
      
      <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2>📊 Database Stats</h2>
        <p>Users in database: {users.length}</p>
        {users.map(user => (
          <div key={user.id}>📧 {user.email} - Role: {user.role}</div>
        ))}
      </div>
      
      <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px' }}>
        <h2>🔗 Available Endpoints</h2>
        <ul>
          <li><a href="/api/health">/api/health</a></li>
          <li><a href="/api/test">/api/test</a></li>
          <li><a href="/api/users">/api/users</a></li>
          <li><a href="/api/routes">/api/routes</a></li>
          <li>POST /api/auth/login</li>
          <li>POST /api/auth/register</li>
        </ul>
      </div>
    </div>
  );
}