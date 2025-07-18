'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Appointment() {
  const [form, setForm] = useState({ name: '', date: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('appointments').insert([form]);
    if (error) alert(error.message);
    else {
      alert('Appointment booked!');
      setForm({ name: '', date: '', phone: '' });
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Full Name" className="border p-2 w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="date" className="border p-2 w-full" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        <input placeholder="Phone" className="border p-2 w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Booking...' : 'Book'}</button>
      </form>
    </main>
  );
}
