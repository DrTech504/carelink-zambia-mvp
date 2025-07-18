'use client';
import Link from 'next/link';
import type { Appointment } from "./types/appointment";
import { useState, useEffect } from 'react';
import providers from './data/providers.json';
import { supabase } from './lib/supabase';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('appointments').select('*').order('date', { ascending: true });
      setAppointments(data || []);
    })();
  }, []);

  const filtered = providers.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.specialty.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Carelink Zambia</h1>
      <input placeholder="Search by name or specialty" className="border px-3 py-2 mb-4 w-full" value={filter} onChange={e => setFilter(e.target.value)} />

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {filtered.map(p => (
          <div key={p.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.specialty}</p>
            <p className="text-xs text-gray-500">{p.location}</p>
            <a href={`tel:${p.phone}`} className="text-blue-600 text-sm">{p.phone}</a>
          </div>
        ))}
      </div>

      <Link href="/appointment" className="bg-blue-600 text-white px-4 py-2 rounded">Book Appointment</Link>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map(a => (
              <li key={a.id} className="border rounded p-3">
                <strong>{a.name}</strong> – {new Date(a.date).toLocaleDateString()} – {a.phone}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
