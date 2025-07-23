'use client'

import React from 'react';

// Define the properties (props) that this component will accept
interface BookingCalendarProps {
  onSelectSlot: (date: Date | null) => void;
  booked: string[];
}

// The component now correctly accepts the props
const BookingCalendar = ({ onSelectSlot, booked }: BookingCalendarProps) => {
  // This is still example data. A developer would make this a real, interactive calendar.
  const handleDayClick = (day: number) => {
    const date = new Date();
    date.setDate(day);
    onSelectSlot(date);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Select a Date</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Dummy calendar days for demonstration */}
        {[...Array(30).keys()].map(i => {
          const day = i + 1;
          const isBooked = booked.includes(`2025-07-${day}`);
          return (
            <div
              key={day}
              onClick={() => !isBooked && handleDayClick(day)}
              className={`p-2 rounded-full cursor-pointer ${
                isBooked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 hover:bg-blue-300'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Note: This is a simplified calendar for demonstration.
      </p>
    </div>
  );
};

export default BookingCalendar;
