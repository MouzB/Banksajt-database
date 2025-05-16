'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('token', data.token);
      router.push('/account');
    } else {
      alert('Fel användarnamn eller lösenord');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Logga in</h2>
      <input placeholder="Användarnamn" value={username} onChange={e => setUsername(e.target.value)} className="block mb-2 border p-2" />
      <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} className="block mb-4 border p-2" />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Logga in</button>
    </div>
  );
}
