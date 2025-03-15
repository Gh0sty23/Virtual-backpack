import React, { useState } from 'react';
import Calendar, { CalendarEvent } from './Calendar';
import './style.css';
import Sidebar from '../Sidebar/Sidebar';

const CalendarApp: React.FC = () => {
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
    <>
    <Sidebar />{/* renders the sidebar only for the apps and not the homepage. I cannot be assed to figure out a modular way to conditionally code this shit */}
    <div className="calendar-wrapper">
      <Calendar
        events={calendarEvents}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
    </>
  );
};

export default CalendarApp;