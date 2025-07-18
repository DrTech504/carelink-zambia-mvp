'use client';
import Link from 'next/link';
import { useState } from 'react';
import providers from './data/providers.json';

export default function Home() {
  const [filter, setFilter] = useState('');

  const filtered = providers.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.specialty.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Carelink Zambia</h1>
      <input
        placeholder="Search by name or specialty"
        className="border px-3 py-2 mb-4 w-full"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(p => (
          <div key={p.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.specialty}</p>
            <p className="text-xs text-gray-500">{p.location}</p>
            <a href={`tel:${p.phone}`} className="text-blue-600 text-sm">
              {p.phone}
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/appointment" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </Link>
      </div>
    </main>
  );
}
