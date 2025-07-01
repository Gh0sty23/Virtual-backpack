// --- START OF FILE Notifications.tsx ---

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from './Calendar';

interface NotificationsProps {
  events: CalendarEvent[];
  // 1. Add the new prop to the interface
  onEventSelect: (event: CalendarEvent) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ events, onEventSelect }) => {
  // ... (no other changes in this file until the return statement)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [futureEvents, setFutureEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const now = new Date();
    const allFuture = events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        if (a.isAllDay && b.isAllDay) return 0;
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
    setFutureEvents(allFuture);
  }, [events]);

  const formatEventDate = (date: Date): string => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEventTime = (event: CalendarEvent): string => {
    if (event.isAllDay) return 'All day';
    if (event.startTime && event.endTime) return `${event.startTime} - ${event.endTime}`;
    if (event.startTime) return event.startTime;
    return '';
  };

  const getTimeUntilEvent = (date: Date): string => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `in ${diffDays}d`;
    if (diffHours > 0) return `in ${diffHours}h`;
    if (diffMinutes > 0) return `in ${diffMinutes}m`;
    return 'Soon';
  };

  return (
    <div className={`notifications-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* ... header code ... */}
      <div className="notifications-header">
        <h3>Upcoming</h3>
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expand notifications' : 'Collapse notifications'}>
          {isCollapsed ? '◀' : '▶'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="notifications-content">
          {futureEvents.length === 0 ? (
            <div className="no-events">
              <p>No upcoming events</p>
              <small>All your future events will appear here.</small>
            </div>
          ) : (
            <div className="events-list">
              {futureEvents.map(event => (
                <div 
                  key={event.id} 
                  className="notification-event"
                  style={{ borderLeftColor: event.color }}
                  // 2. Add the onClick handler to the event container
                  onClick={() => onEventSelect(event)}
                >
                  <div className="event-header">
                    <span className="event-date">{formatEventDate(new Date(event.date))}</span>
                    <span className="time-until">{getTimeUntilEvent(new Date(event.date))}</span>
                  </div>
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">{formatEventTime(event)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;