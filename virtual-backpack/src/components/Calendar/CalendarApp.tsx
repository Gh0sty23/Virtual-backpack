import React, { useState, useEffect } from 'react'; // Import useEffect
import { Calendar, CalendarEvent } from './Calendar';
import Notifications from './Notifications';
import { render } from '@react-email/render';
import { NewEventNotification } from '../Emails/NewEventNotification';

const CalendarApp: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedDataString = localStorage.getItem('VIRTUAL_ID_DATA');
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        if (savedData.email) {
          setUserEmail(savedData.email);
          console.log('[CalendarApp] User email loaded on component mount:', savedData.email);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const handleAddEvent = async (newEventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...newEventData,
      id: Date.now().toString()
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    if (!userEmail) {
      alert('Could not find user email. Please create or load a Virtual ID first.');
      console.error('[Frontend] ERROR: userEmail state is not set.');
      return;
    }

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
        to: userEmail,
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