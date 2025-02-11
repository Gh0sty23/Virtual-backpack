import React, { useState } from 'react';
import Calendar from './Calendar.tsx';
import './style.css';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color: string;
}

const ParentComponent: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      color: newEvent.color || '#2196f3'
    };
    setCalendarEvents(prev => [...prev, event]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        events={calendarEvents}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default ParentComponent;