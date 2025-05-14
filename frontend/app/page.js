'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <nav className="flex gap-4 mb-6">
        <Link href="/">Hem</Link>
        <Link href="/login">Logga in</Link>
        <Link href="/createuser">Skapa användare</Link>
      </nav>
      <section className="bg-blue-100 p-8 rounded-lg text-center">
        <h1 className="text-3xl mb-4">Välkommen till Banken</h1>
        <Link href="/createuser" className="bg-blue-600 text-white px-4 py-2 rounded">
          Skapa användare
        </Link>
      </section>
    </div>
  );
}
