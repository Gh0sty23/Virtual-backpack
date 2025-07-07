import React, { useState } from 'react';
import { Calendar, CalendarEvent } from './Calendar';
import Notifications from './Notifications';

const CalendarApp: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  // 1. State to track the event selected for editing, from anywhere in the app.
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

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

  const handleEventsLoad = (loadedEvents: CalendarEvent[]) => {
    setCalendarEvents(loadedEvents);
  };

  // 2. Handler to be called when an event is selected from ANY component.
  const handleEventSelect = (event: CalendarEvent) => {
    setEventToEdit(event);
  };

  // 3. Handler to be called when the modal is closed.
  const handleModalClose = () => {
    setEventToEdit(null);
  };

  return (
    <>
      <Calendar
        events={calendarEvents}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onEventsLoad={handleEventsLoad}
        // 4. Pass the new state and handlers down to the Calendar
        eventToEdit={eventToEdit}
        onEventSelect={handleEventSelect}
        onModalClose={handleModalClose}
      />
      <Notifications
        events={calendarEvents}
        // 5. Pass the select handler to the Notifications sidebar
        onEventSelect={handleEventSelect}
      />
    </>
  );
};

export default CalendarApp;