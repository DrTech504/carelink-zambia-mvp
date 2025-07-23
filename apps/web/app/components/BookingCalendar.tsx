'use client'

import React from 'react'; // Removed unused 'useState'

// Define a specific type for a booking instead of using 'any'
interface Booking {
  id: number;
  time: string;
}

const BookingCalendar = () => {
  // Example data
  const bookings: Booking[] = [ // Use the new type here
    { id: 1, time: '10:00 AM' },
    { id: 2, time: '02:00 PM' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Today's Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id} className="mb-2">
            <span>{booking.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingCalendar;
