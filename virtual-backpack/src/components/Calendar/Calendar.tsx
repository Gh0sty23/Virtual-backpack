import React, { useState } from 'react';
import './style.css';
import {
  format, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, addWeeks
} from 'date-fns';

// Export the interface separately to fix the import issue
export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color: string;
}

interface CalendarProps {
  view?: 'month' | 'week';
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent?: (eventId: string) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  view = 'month',
  events = [],
  onAddEvent,
  onDeleteEvent,
  selectedDate,
  onDateChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>(view);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEventDate, setNewEventDate] = useState<Date>(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Correction is in this function ---
  const getViewDates = () => {
    let start, end;
    if (viewType === 'month') {
      // Get the first and last day of the currently selected month
      const firstDayOfMonth = startOfMonth(currentDate);
      const lastDayOfMonth = endOfMonth(currentDate);
      // Get the start of the week (Sunday) containing the first day
      start = startOfWeek(firstDayOfMonth);
      // Get the end of the week (Saturday) containing the last day
      end = endOfWeek(lastDayOfMonth);
    } else { // 'week' view
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    }
    // Generate all days within the calculated range
    return eachDayOfInterval({ start, end });
  };
  // --- End of correction ---


  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      onAddEvent({
        date: newEventDate,
        title: newEventTitle,
        color: '#2196f3' // Ensure color is provided if not passed
      });
      setIsAddModalOpen(false);
      setNewEventTitle('');
    }
  };

  const changeViewPeriod = (direction: 'next' | 'prev') => {
    setCurrentDate(prev => {
      const modifier = direction === 'next' ? 1 : -1;
      return viewType === 'month'
        ? addMonths(prev, modifier)
        : addWeeks(prev, modifier);
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button onClick={() => changeViewPeriod('prev')}>&lt;</button>
        <h2>
          {viewType === 'month'
            ? format(currentDate, 'MMMM yyyy')
            : `${format(startOfWeek(currentDate), 'MMM d')} - 
               ${format(endOfWeek(currentDate), 'MMM d')}`}
        </h2>
        <button onClick={() => changeViewPeriod('next')}>&gt;</button>

        <div className="view-toggle">
          <button
            className={viewType === 'month' ? 'active' : ''}
            onClick={() => setViewType('month')}
          >
            Month
          </button>
          <button
            className={viewType === 'week' ? 'active' : ''}
            onClick={() => setViewType('week')}
          >
            Week
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {getViewDates().map(date => {
          // Check if event.date is valid before creating a Date object
          const dayEvents = events.filter((event: CalendarEvent) =>
            event.date && isSameDay(new Date(event.date), date)
          );

          return (
            <div
              key={date.toISOString()}
              // Added `isSameMonth` check for correct styling
              className={`calendar-day 
                ${!isSameMonth(date, currentDate) ? 'other-month' : ''} 
                ${isSameDay(date, new Date()) ? 'today' : ''}
                ${selectedDate && isSameDay(date, selectedDate) ? 'selected' : ''}`}
              onClick={() => {
                setNewEventDate(date);
                setIsAddModalOpen(true);
                onDateChange?.(date);
              }}
            >
              <div className="day-number">{format(date, 'd')}</div>
              <div className="day-events">
                {dayEvents.map((event: CalendarEvent) => (
                  <div
                    key={event.id}
                    className="event-badge"
                    style={{ backgroundColor: event.color || '#2196f3' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click when clicking event
                      setSelectedEvent(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="calendar-modal">
          <div className="modal-content">
            <h3>Add Event - {format(newEventDate, 'MMM d, yyyy')}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
            />
            <div className="modal-actions">
              <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button
                onClick={handleAddEvent}
                disabled={!newEventTitle.trim()}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="calendar-modal">
          <div className="modal-content">
            <h3>Event Details</h3>
            {/* Ensure selectedEvent.date is valid */}
            <p>Date: {selectedEvent.date ? format(new Date(selectedEvent.date), 'MMM d, yyyy') : 'Invalid Date'}</p>
            <p>Title: {selectedEvent.title}</p>
            <div className="modal-actions">
              <button onClick={() => setSelectedEvent(null)}>Close</button>
              {onDeleteEvent && (
                <button
                  onClick={() => {
                    onDeleteEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  style={{ backgroundColor: '#f44336', color: 'white' }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;