import React, { useState } from 'react';
import { Calendar, CalendarEvent } from './Calendar';

const CalendarApp: React.FC = () => {
  // Initial events state is now an empty array
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString()
    };
    setCalendarEvents(prev => [...prev, event]);
  };

  const handleEditEvent = (eventId: string, updatedEvent: Omit<CalendarEvent, 'id'>) => {
    setCalendarEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...updatedEvent, id: eventId }
          : event
      )
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    // The outer div and H1 title have been removed for a cleaner look
    <Calendar
      events={calendarEvents}
      onAddEvent={handleAddEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
};

export default CalendarApp;