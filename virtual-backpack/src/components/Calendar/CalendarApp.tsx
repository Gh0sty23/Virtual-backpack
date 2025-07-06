import React, { useState } from 'react';
import { Calendar, CalendarEvent } from './Calendar';
import Notifications from './Notifications';
import { render } from '@react-email/render';
import { NewEventNotification } from '../Emails/NewEventNotification';

const CalendarApp: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

const handleAddEvent = async (newEventData: Omit<CalendarEvent, 'id'>) => {
  const newEvent: CalendarEvent = {
    ...newEventData,
    id: Date.now().toString()
  };
  setCalendarEvents(prev => [...prev, newEvent]);

  try {
    console.log("1. [Frontend] Rendering email component...");
    const emailHtml = await render(
      <NewEventNotification
        title={newEvent.title}
        date={newEvent.date.toLocaleDateString()}
        description={newEvent.description}
      />
    );
    console.log("2. [Frontend] Email rendered to HTML. Preparing to send to server.");

    const payload = {
      to: 'charuzu.kazumi@gmail.com', // <-- location for email
      subject: `New Event Added: ${newEvent.title}`,
      html: emailHtml,
    };

    console.log("3. [Frontend] Sending this payload to server:", payload);

    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("5. [Frontend] SUCCESS: Server responded OK.", responseData);
      alert('Notification email sent successfully!');
    } else {
      console.error("5. [Frontend] ERROR: Server responded with an error.", responseData);
      alert(`Failed to send email. Server said: ${responseData.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('5. [Frontend] CATCH ERROR: A fatal error occurred during fetch.', error);
    alert('A fatal error occurred. Check the console.');
  }
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

  const handleEventSelect = (event: CalendarEvent) => {
    setEventToEdit(event);
  };

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
        eventToEdit={eventToEdit}
        onEventSelect={handleEventSelect}
        onModalClose={handleModalClose}
      />
      <Notifications
        events={calendarEvents}
        onEventSelect={handleEventSelect}
      />
    </>
  );
};

export default CalendarApp;