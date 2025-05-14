'use client';
import { useEffect, useState } from 'react';

export default function Account() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3001/me/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => setBalance(data.amount));
    }
  }, [token]);

  const handleDeposit = async () => {
    const res = await fetch('http://localhost:3001/me/accounts/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, amount: parseInt(amount) }),
    });
    const data = await res.json();
    setBalance(data.newAmount);
    setAmount('');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Ditt Konto</h2>
      {balance !== null ? (
        <>
          <p className="mb-4">Saldo: {balance} kr</p>
          <input type="number" placeholder="Belopp att sätta in" value={amount} onChange={e => setAmount(e.target.value)} className="block mb-2 border p-2" />
          <button onClick={handleDeposit} className="bg-green-600 text-white px-4 py-2 rounded">Sätt in pengar</button>
        </>
      ) : (
        <p>Laddar saldo...</p>
      )}
    </div>
  );
}
