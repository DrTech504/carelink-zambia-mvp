'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import BookingCalendar from '../components/BookingCalendar';
import { sendEmail } from '../lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Slot { date: string; start: string; end: string; provider: string }

export default function Appointment() {
  const [form, setForm] = useState({ name: '', phone: '', provider: '' });
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [p, s] = await Promise.all([
        supabase.from('providers').select('*'),
        supabase.from('availability').select('*, providers(name)')
      ]);
      setProviders(p.data || []);
      setSlots((s.data || []).map((d: any) => ({
        date: d.date,
        start: d.start_time,
        end: d.end_time,
        provider: d.providers.name
      })));
    })();
  }, []);

  const booked = slots.map(s => s.date + ' ' + s.start);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return alert('Pick a slot');
    const key = selectedSlot.date + ' ' + selectedSlot.start;
    if (booked.includes(key)) return alert('Slot taken');
    await supabase.from('appointments').insert([
      { name: form.name, phone: form.phone, date: selectedSlot.date, provider: selectedSlot.provider }
    ]);
    await sendEmail(form.name + "@example.com", "Appointment Confirmed", `<h1>Booked on ${selectedSlot.date}</h1>`);
    alert('Appointment booked + email sent!');
    setForm({ name: '', phone: '', provider: '' });
    setSelectedSlot(null);
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Slot (Provider Calendar)</h1>
      <select className="border p-2 mb-4 w-full" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} required>
        <option value="">Select provider</option>
        {providers.map(p => <option key={p.id} value={p.name}>{p.name} – {p.specialty}</option>)}
      </select>
      <BookingCalendar onSelectSlot={(date) => {
        const slot = slots.find(s => s.date === date.toISOString().split('T')[0] && s.provider === form.provider);
        setSelectedSlot(slot || null);
      }} booked={booked} />
      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input placeholder="Full name" className="border p-2 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Phone" className="border p-2 w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <p className="text-sm">Selected: {selectedSlot.date} {selectedSlot.start}–{selectedSlot.end}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Book</button>
        </form>
      )}
    </main>
  );
}
