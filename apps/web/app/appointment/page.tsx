'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import BookingCalendar from '../components/BookingCalendar';   // ← correct relative path
import type { Appointment } from '../types/appointment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Appointment() {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [booked, setBooked] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('appointments').select('date');
      setBooked((data || []).map(d => d.date));
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return alert('Pick a date first');
    if (booked.includes(selectedDate.toISOString().split('T')[0])) return alert('Slot taken');
    const { error } = await supabase.from('appointments').insert([{ ...form, date: selectedDate.toISOString().split('T')[0] }]);
    if (error) alert(error.message);
    else {
      alert('Appointment booked!');
      setBooked([...booked, selectedDate.toISOString().split('T')[0]]);
      setForm({ name: '', phone: '' });
      setSelectedDate(null);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Appointment (Calendar)</h1>
      <BookingCalendar onSelectSlot={setSelectedDate} booked={booked} />
      {selectedDate && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Full name" className="border p-2 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Phone" className="border p-2 w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <p className="text-sm">Selected: {selectedDate.toDateString()}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Book</button>
        </form>
      )}
    </main>
  );
}
