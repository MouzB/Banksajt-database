'use client';
import { useState } from 'react';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Skapa användare</h2>
      <input placeholder="Användarnamn" value={username} onChange={e => setUsername(e.target.value)} className="block mb-2 border p-2" />
      <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} className="block mb-4 border p-2" />
      <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Skapa</button>
      {message && <p className="mt-4 text-blue-700">{message}</p>}
    </div>
  );
}
