'use client'

import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import BookingCalendar from '../components/BookingCalendar';
import { createClient } from '@/app/lib/supabase/client';

export default function AppointmentPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [form, setForm] = useState({ name: '', email: '' });
    const [booked, setBooked] = useState<string[]>([]); // Example: ['2024-07-25']
    const supabase = createClient();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        const { data, error } = await supabase.from('appointments').insert([
            {
                name: form.name,
                email: form.email,
                date: selectedDate.toISOString(),
            },
        ]);

        if (error) {
            alert('Failed to book appointment: ' + error.message);
        } else {
            alert('Appointment booked successfully!');
            setForm({ name: '', email: '' });
            setSelectedDate(null);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8">
            <main className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Book Appointment</h1>
                <BookingCalendar onSelectSlot={setSelectedDate} booked={booked} />
                {selectedDate && (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <h2 className="text-lg font-semibold">Confirm details for: {selectedDate.toDateString()}</h2>
                        <input placeholder="Full name" className="border p-2 w-full rounded-md" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <input placeholder="Email" type="email" className="border p-2 w-full rounded-md" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                            Confirm Booking
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}
