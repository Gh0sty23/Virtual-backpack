import React, { useState, useEffect } from 'react';
import './style.css';
import Sidebar from '../Sidebar/Sidebar';

// --- INTERFACES ---
export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  color: string;
}

interface CalendarProps {
  view?: 'month' | 'week';
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEditEvent?: (eventId: string, event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent?: (eventId: string) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventsLoad?: (events: CalendarEvent[]) => void;
  eventToEdit?: CalendarEvent | null;
  onEventSelect?: (event: CalendarEvent) => void;
  onModalClose?: () => void;
}

interface ValidationErrors {
  title?: string;
  time?: string;
  date?: string;
}

// --- UTILITY FUNCTIONS ---
const formatDate = (date: Date, format: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  switch (format) {
    case 'MMMM yyyy':
      return `${fullMonths[date.getMonth()]} ${date.getFullYear()}`;
    case 'MMM d':
      return `${months[date.getMonth()]} ${date.getDate()}`;
    case 'MMM d, yyyy':
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    case 'd':
      return date.getDate().toString();
    default:
      return date.toLocaleDateString();
  }
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isDateBeforeToday = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

const endOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + (6 - d.getDay()));
  return d;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

const addMonths = (date: Date, amount: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
};

const addWeeks = (date: Date, amount: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (amount * 7));
  return newDate;
};

const parseTime = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// --- CALENDAR COMPONENT ---
export const Calendar: React.FC<CalendarProps> = ({
  view = 'month',
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  selectedDate,
  onDateChange,
  onEventsLoad,
  eventToEdit,
  onEventSelect,
  onModalClose,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>(view);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date>(new Date());
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    isAllDay: false,
    color: '#2196f3'
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  useEffect(() => {
    if (eventToEdit) {
      openEditModal(eventToEdit);
    }
  }, [eventToEdit]);  
  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents && events.length === 0) {
      try {
        const parsed = JSON.parse(savedEvents);
        const eventsWithDateObjects = parsed.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        onEventsLoad?.(eventsWithDateObjects);
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
        showNotification('Failed to load saved events', 'error');
      }
    }
  }, [events.length, onEventsLoad]);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem('calendar-events', JSON.stringify(events));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
        showNotification('Failed to save events', 'error');
      }
    }
  }, [events]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getViewDates = () => {
    let start, end;
    if (viewType === 'month') {
      const firstDayOfMonth = startOfMonth(currentDate);
      const lastDayOfMonth = endOfMonth(currentDate);
      start = startOfWeek(firstDayOfMonth);
      end = endOfWeek(lastDayOfMonth);
    } else {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    }
    return eachDayOfInterval(start, end);
  };

  const validateEventForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!eventForm.title.trim()) {
      errors.title = 'Event title is required';
    }

    if (isDateBeforeToday(newEventDate)) {
      errors.date = 'Cannot create events for past dates';
    }

    if (!eventForm.isAllDay && eventForm.startTime && eventForm.endTime) {
      const startTime = parseTime(eventForm.startTime);
      const endTime = parseTime(eventForm.endTime);
      
      if (endTime <= startTime) {
        errors.time = 'End time must be after start time';
      }
    }

    return errors;
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      isAllDay: false,
      color: '#2196f3'
    });
    setValidationErrors({});
  };

  const openAddModal = (date: Date) => {
    if (isDateBeforeToday(date)) {
      showNotification('Cannot create events for past dates', 'error');
      return;
    }
    
    setNewEventDate(date);
    setIsEditing(false);
    setSelectedEvent(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setEventForm({
      title: event.title,
      description: event.description || '',
      startTime: event.startTime || '09:00',
      endTime: event.endTime || '10:00',
      isAllDay: event.isAllDay,
      color: event.color
    });
    setNewEventDate(new Date(event.date));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onModalClose?.(); // 4. Tell the parent the modal is closed
  };
  const handleSaveEvent = () => {
    const errors = validateEventForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const eventData = {
      date: newEventDate,
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      startTime: eventForm.isAllDay ? undefined : eventForm.startTime,
      endTime: eventForm.isAllDay ? undefined : eventForm.endTime,
      isAllDay: eventForm.isAllDay,
      color: eventForm.color
    };

    if (isEditing && selectedEvent) {
      onEditEvent?.(selectedEvent.id, eventData);
      showNotification('Event updated successfully', 'success');
    } else {
      onAddEvent?.(eventData);
      showNotification('Event created successfully', 'success');
    }

    closeModal(); // 5. Use the new close function
    resetForm();
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent?.(eventId);
    setIsModalOpen(false);
    setSelectedEvent(null);
    showNotification('Event deleted successfully', 'success');
    closeModal();
  };

  const changeViewPeriod = (direction: 'next' | 'prev') => {
    setCurrentDate(prev => {
      const modifier = direction === 'next' ? 1 : -1;
      return viewType === 'month'
        ? addMonths(prev, modifier)
        : addWeeks(prev, modifier);
    });
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.isAllDay) return 'All day';
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return '';
  };

  return (
    <>
      {/* renders the sidebar only for the apps and not the homepage. I cannot be assed to figure out a modular way to conditionally code this shit */}
      <Sidebar />

      <div className={`calendar-container ${viewType === 'week' ? 'week-view' : 'month-view'}`}>
        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Controls */}
        <div className="calendar-controls">
          <button onClick={() => changeViewPeriod('prev')}>&lt;</button>
          <h2>
            {viewType === 'month'
              ? formatDate(currentDate, 'MMMM yyyy')
              : `${formatDate(startOfWeek(currentDate), 'MMM d')} - ${formatDate(endOfWeek(currentDate), 'MMM d')}`}
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

        {/* Grid */}
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {getViewDates().map(date => {
            const dayEvents = events.filter((event: CalendarEvent) =>
              event.date && isSameDay(new Date(event.date), date)
            );
            const isPastDate = isDateBeforeToday(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`calendar-day 
                  ${!isSameMonth(date, currentDate) ? 'other-month' : ''} 
                  ${isSameDay(date, new Date()) ? 'today' : ''}
                  ${selectedDate && isSameDay(date, selectedDate) ? 'selected' : ''}
                  ${isPastDate ? 'past-date' : ''}`}
                onClick={() => {
                  if (!isPastDate) {
                    openAddModal(date);
                    onDateChange?.(date);
                  }
                }}
              >
                <div className="day-number">{formatDate(date, 'd')}</div>
                <div className="day-events">
                  {dayEvents.map((event: CalendarEvent) => (
                    <div
                      key={event.id}
                      className={`event-badge compact ${event.isAllDay ? 'all-day' : ''}`}
                      style={{ backgroundColor: event.color || '#2196f3' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(event);
                      }}
                      title={`${event.title} ${formatEventTime(event)}`}
                    >
                      <div className="event-title">{event.title}</div>
                      {!event.isAllDay && event.startTime && event.endTime && (
                        <div className="event-time-range">{event.startTime} - {event.endTime}</div>
                      )}
                      {!event.isAllDay && event.startTime && !event.endTime && (
                        <div className="event-time-range">{event.startTime}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="calendar-modal">
            <div className="modal-content">
              <h3>{isEditing ? 'Edit Event' : 'Add Event'} - {formatDate(newEventDate, 'MMM d, yyyy')}</h3>
              
              <div className="form-group">
                <label htmlFor="event-title">Event Title *</label>
                <input id="event-title" type="text" placeholder="Enter event title" value={eventForm.title} onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))} className={validationErrors.title ? 'error' : ''} />
                {validationErrors.title && <div className="error-message">{validationErrors.title}</div>}
              </div>

              {/* THIS WAS MISSING: Description Textarea */}
              <div className="form-group">
                <label htmlFor="event-description">Description</label>
                <textarea id="event-description" placeholder="Add details about the event..." rows={3} value={eventForm.description} onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              
              {validationErrors.date && <div className="error-message date-error">{validationErrors.date}</div>}
              
              {/* THIS WAS MISSING: Inline group for All Day and Color */}
              <div className="modal-inline-group">
                <div className="form-group">
                  <label className="checkbox-group">
                    <input type="checkbox" checked={eventForm.isAllDay} onChange={e => setEventForm(prev => ({ ...prev, isAllDay: e.target.checked }))} /> All Day Event
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="event-color">Color</label>
                  <input id="event-color" type="color" value={eventForm.color} onChange={e => setEventForm(prev => ({ ...prev, color: e.target.value }))} />
                </div>
              </div>

              {!eventForm.isAllDay && (
                <div className="time-inputs">
                  <div className="form-group">
                    <label htmlFor="start-time">Start Time</label>
                    <input id="start-time" type="time" value={eventForm.startTime} onChange={e => setEventForm(prev => ({ ...prev, startTime: e.target.value }))} className={validationErrors.time ? 'error' : ''} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end-time">End Time</label>
                    <input id="end-time" type="time" value={eventForm.endTime} onChange={e => setEventForm(prev => ({ ...prev, endTime: e.target.value }))} className={validationErrors.time ? 'error' : ''} />
                  </div>
                  {validationErrors.time && <div className="error-message time-error">{validationErrors.time}</div>}
                </div>
              )}

              <div className="modal-actions">
                <button onClick={closeModal}>Cancel</button>
                {isEditing && (
                  <button onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)} className="delete-btn">Delete</button>
                )}
                <button onClick={handleSaveEvent} className="save-btn">{isEditing ? 'Update' : 'Add'} Event</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};