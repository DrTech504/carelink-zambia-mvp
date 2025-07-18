'use client';
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface BookingCalendarProps {
  onSelectSlot: (date: Date) => void;
  booked: string[]; // ISO strings
}

export default function BookingCalendar({ onSelectSlot, booked }: BookingCalendarProps) {
  const events = booked.map(d => ({
    title: 'Booked',
    start: new Date(d),
    end: new Date(new Date(d).getTime() + 30 * 60 * 1000), // 30 min slot
    allDay: false,
  }));

  return (
    <div className="h-96 mb-4">
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={({ start }) => onSelectSlot(start)}
        defaultView="month"
        min={new Date(new Date().setHours(8, 0, 0, 0))}
        max={new Date(new Date().setHours(17, 0, 0, 0))}
        eventPropGetter={() => ({ style: { backgroundColor: '#ef4444', color: '#fff' } })}
      />
    </div>
  );
}
