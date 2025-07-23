'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import providersData from './data/providers.json'

interface Provider {
  id: number
  name: string
  specialty: string
  availability: string[]
}

// Define a specific type for an appointment instead of using 'any'
interface Appointment {
  id: number;
  provider: string;
  time: string;
  date: string;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([])
  const [filter, setFilter] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([]) // Use the new type here

  useEffect(() => {
    setIsMounted(true);
    setProviders(providersData)
    setAppointments([
      { id: 1, provider: 'Dr. Phiri', time: '10:00 AM', date: '2024-07-25' },
      { id: 2, provider: 'Dr. Banda', time: '02:30 PM', date: '2024-07-26' },
    ])
  }, [])

  if (!isMounted) {
    return null;
  }

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(filter.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">{appt.provider}</p>
                <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
              </div>
              <button className="text-sm text-red-500">Cancel</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Provider Directory</h2>
        <input
          placeholder="Search by name or specialty"
          className="border px-3 py-2 mb-4 w-full"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold">{provider.name}</h3>
              <p className="text-gray-600">{provider.specialty}</p>
              <Link href="/appointment">
                 <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
                    Book Appointment
                 </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
