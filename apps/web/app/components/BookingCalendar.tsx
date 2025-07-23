'use client'

import React from 'react';

interface Booking {
  id: number;
  time: string;
}

const BookingCalendar = () => {
  const bookings: Booking[] = [
    { id: 1, time: '10:00 AM' },
    { id: 2, time: '02:00 PM' },
  ];

  return (
    <div>
      {/* The apostrophe in "Today's" is now correctly escaped. */}
      <h2 className="text-xl font-bold mb-4">Today&apos;s Bookings</h2>
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
