import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import Sidebar from '../Sidebar/Sidebar'; // Assuming Sidebar component exists

interface Todo {
  id: string;
  taskName: string;
  taskPriority: 'High' | 'Medium' | 'Low';
  taskDate: string;
  completed: boolean;
  isEditing: boolean; // Retained for potential future use if directly manipulating isEditing
}

interface TodoFormData {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

// Simple Error Display Component (can be enhanced)
const ErrorMessage: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return <div className="error-message">{message}</div>;
};

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Clear error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); // Clear error after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // In a real app, you would fetch todos from local storage or an API
    // For now, using sample todos and simulating potential load error
    try {
      const sampleTodos: Todo[] = [
        {
          id: '1',
          taskName: 'Complete project proposal',
          taskPriority: 'High',
          taskDate: '2025-06-24',
          completed: false,
          isEditing: false,
        },
        {
          id: '2',
          taskName: 'Review design mockups',
          taskPriority: 'Medium',
          taskDate: '2025-06-25',
          completed: false,
          isEditing: false,
        },
        {
          id: '3',
          taskName: 'Update documentation',
          taskPriority: 'Low',
          taskDate: '2025-06-23',
          completed: true,
          isEditing: false,
        },
      ];
      // Simulate a case where taskDate might be invalid
      // sampleTodos[0].taskDate = "invalid-date"; // Uncomment to test date parsing error
      setTodos(sampleTodos);
    } catch (e) {
      console.error("Error loading initial todos:", e);
      setError("Failed to load initial tasks. Please refresh.");
    }
  }, []);

  const validateFormData = (formData: TodoFormData): boolean => {
    if (!formData.name.trim()) {
      setError('Task name cannot be empty.');
      return false;
    }
    if (!formData.date) {
      setError('Due date must be selected.');
      return false;
    }
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0,0,0,0); // Compare dates only
    // Example: Disallow past dates for new tasks (can be adjusted)
    // if (selectedDate < today && !editingTodo) { // Apply only for new tasks, or make it universal
    //   setError('Due date cannot be in the past for new tasks.');
    //   return false;
    // }
    setError(null); // Clear previous errors if validation passes
    return true;
  };

  const addTodo = (formData: TodoFormData) => {
    if (!validateFormData(formData)) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      taskName: formData.name.trim(), // Trim whitespace
      taskPriority: formData.priority,
      taskDate: formData.date,
      completed: false,
      isEditing: false,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    setShowAddForm(false);
  };

  const toggleComplete = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    // Optional: Add a confirmation step before deleting
    // if (!window.confirm("Are you sure you want to delete this task?")) return;
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    if (todo.completed) {
        setError("Completed tasks cannot be edited.");
        return;
    }
    setEditingTodo({ ...todo }); // Create a copy for editing
    setError(null); // Clear any previous errors
  };

  const saveEdit = (formData: TodoFormData) => {
    if (!editingTodo) {
      setError("No task selected for editing.");
      return;
    }
    if (!validateFormData(formData)) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === editingTodo.id
          ? {
              ...todo,
              taskName: formData.name.trim(),
              taskPriority: formData.priority,
              taskDate: formData.date,
              // isEditing: false, // This is handled by setEditingTodo(null)
            }
          : todo
      )
    );
    setEditingTodo(null);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setError(null); // Clear any errors when canceling edit
  };

  const getTodosByCategory = (category: 'today' | 'upcoming' | 'missed') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter(todo => {
      if (todo.completed && category !== 'missed') return false; // Keep completed missed tasks visible

      try {
        const taskDateObj = new Date(todo.taskDate);
        if (isNaN(taskDateObj.getTime())) { // Check for invalid date
            // console.warn(`Invalid date found for task ID ${todo.id}: ${todo.taskDate}`);
            if(category === 'missed') return true; // Show in missed if date is bad
            return false; // Skip if date is invalid for other categories
        }
        taskDateObj.setHours(0, 0, 0, 0);

        switch (category) {
          case 'today':
            return taskDateObj.getTime() === today.getTime() && !todo.completed;
          case 'upcoming':
            return taskDateObj > today && !todo.completed;
          case 'missed':
            // Show if task date is before today AND not completed OR if task date is invalid
            return (taskDateObj < today && !todo.completed) || (isNaN(new Date(todo.taskDate).getTime()) && !todo.completed) ;
          default:
            return false;
        }
      } catch (e) {
        // console.error(`Error processing date for task ${todo.id}:`, e);
        if(category === 'missed') return true; // if date processing fails, assume missed
        return false;
      }
    });
  };

  const getTodosByPriority = (
    categoryTodos: Todo[],
    priority: 'High' | 'Medium' | 'Low'
  ) => {
    return categoryTodos.filter(todo => todo.taskPriority === priority);
  };

  // --- Re-usable Components (TaskColumn, PrioritySection, TaskItem, TodoForm) ---
  // These components remain largely the same but will benefit from error display

  const TaskColumn = ({ title, category, icon }: { title: string; category: 'today' | 'upcoming' | 'missed'; icon: string }) => {
    const categoryTodos = getTodosByCategory(category);
    const highPriority = getTodosByPriority(categoryTodos, 'High');
    const mediumPriority = getTodosByPriority(categoryTodos, 'Medium');
    const lowPriority = getTodosByPriority(categoryTodos, 'Low');

    return (
      <div className={`column ${category}`}>
        <div className="column-header">
          <div className="column-title">
            <span className="column-icon">{icon}</span>
            {title}
          </div>
          <div className="task-count">{categoryTodos.length}</div>
        </div>

        <PrioritySection
          title="High Priority"
          todos={highPriority}
          priority="high" // CSS class name
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={startEditing}
        />

        <PrioritySection
          title="Medium Priority"
          todos={mediumPriority}
          priority="medium" // CSS class name
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={startEditing}
        />

        <PrioritySection
          title="Low Priority"
          todos={lowPriority}
          priority="low" // CSS class name
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={startEditing}
        />
      </div>
    );
  };

  const PrioritySection = ({
    title,
    todos,
    priority,
    onToggleComplete,
    onDelete,
    onEdit
  }: {
    title: string;
    todos: Todo[];
    priority: 'high' | 'medium' | 'low'; // For CSS class
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (todo: Todo) => void;
  }) => (
    <div className="priority-section">
      <div className={`priority-header ${priority}-priority`}>
        <div className="priority-indicator"></div>
        {title}
      </div>
      <div className="task-list">
        {todos.length === 0 ? (
          <div className="empty-state">No tasks</div>
        ) : (
          todos.map(todo => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );

  const TaskItem = ({
    todo,
    onToggleComplete,
    onDelete,
    onEdit
  }: {
    todo: Todo;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (todo: Todo) => void;
  }) => (
    <div className={`task-item ${todo.completed ? 'task-item-completed' : ''}`}>
      <div
        className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggleComplete(todo.id)}
        role="checkbox"
        aria-checked={todo.completed}
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onToggleComplete(todo.id)}
      >
        {todo.completed && '✓'}
      </div>
      
      <div className="task-content">
        <div className={`task-title ${todo.completed ? 'completed' : ''}`}>
          {todo.taskName}
        </div>
        <div className="task-date">
          {/* Add error handling for date display if needed, though getTodosByCategory handles most */}
          {new Date(todo.taskDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      <div className="task-actions">
        {!todo.completed && ( // Only show edit button if not completed
            <button
            onClick={() => onEdit(todo)}
            className="action-btn edit-btn"
            title="Edit"
            aria-label={`Edit task ${todo.taskName}`}
            >
            ✏️
            </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="action-btn delete-btn"
          title="Delete"
          aria-label={`Delete task ${todo.taskName}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const TodoForm = ({
    initialData,
    onSubmit,
    onCancel,
    title,
    formError // Prop to pass form-specific errors
  }: {
    initialData?: TodoFormData;
    onSubmit: (data: TodoFormData) => void;
    onCancel: () => void;
    title: string;
    formError?: string | null; // Optional: for form specific errors
  }) => {
    const [formData, setFormData] = useState<TodoFormData>(
      // Ensure initialData is correctly structured or default
      initialData || { name: '', priority: 'Low', date: '' }
    );
    const [currentFormError, setCurrentFormError] = useState<string | null>(null);

    // Update local form error if prop changes
    useEffect(() => {
        setCurrentFormError(formError || null);
    }, [formError]);


    // Effect to set focus on the first input field when the form opens
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);


    const handleFormInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setCurrentFormError(null); // Clear error on input change
      };


    const handleSubmitInternal = () => {
      // Basic client-side validation within the form itself
      if (!formData.name.trim()) {
        setCurrentFormError('Task name is required.');
        return;
      }
      if (!formData.date) {
        setCurrentFormError('Due date is required.');
        return;
      }
      // More specific date validation can be added here if needed
      // e.g., ensuring date format is correct or not in the distant past/future

      setCurrentFormError(null); // Clear local error
      onSubmit(formData); // Call parent onSubmit, which should also validate
      // Don't reset form here, parent will close modal or re-render
    };

    return (
      <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="formTitle">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
          <div className="modal-header">
            <h2 id="formTitle">{title}</h2>
            <button className="close-btn" onClick={onCancel} aria-label="Close form">×</button>
          </div>
          
          <div className="modal-body">
            {/* Display form-specific error message */}
            <ErrorMessage message={currentFormError} />

            <div className="form-group">
              <label htmlFor="taskNameInput">Task Name</label>
              <input
                id="taskNameInput"
                ref={nameInputRef} // For focusing
                type="text"
                name="name" // For controlled component
                value={formData.name}
                onChange={handleFormInputChange}
                placeholder="Enter task name"
                aria-required="true"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="prioritySelect">Priority</label>
              <select
                id="prioritySelect"
                name="priority" // For controlled component
                value={formData.priority}
                onChange={handleFormInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateInput">Due Date</label>
              <input
                id="dateInput"
                type="date"
                name="date" // For controlled component
                value={formData.date}
                onChange={handleFormInputChange}
                aria-required="true"
              />
            </div>
            
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
              <button type="button" className="submit-btn" onClick={handleSubmitInternal}>
                {initialData ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Sidebar />
      <div className="todo-app">
        <div className="container">
          <div className="header">
            <h1>TO-DO LIST</h1>
            {/* Display global error messages */}
            <ErrorMessage message={error} />
          </div>

          <div className="board">
            <TaskColumn title="Today" category="today" icon="📅" />
            <TaskColumn title="Upcoming" category="upcoming" icon="📋" />
            <TaskColumn title="Missed" category="missed" icon="⚠️" />
          </div>

          <div className="add-task-container">
            <button
              onClick={() => { setShowAddForm(true); setError(null); }} // Clear global error when opening form
              className="add-task-btn"
            >
              + Add New Task
            </button>
          </div>

          {showAddForm && (
            <TodoForm
              title="Add New Task"
              onSubmit={addTodo}
              onCancel={() => { setShowAddForm(false); setError(null); }}
              formError={error} // Pass global error to form if relevant
            />
          )}

          {editingTodo && (
            <TodoForm
              title="Edit Task"
              initialData={{
                name: editingTodo.taskName,
                priority: editingTodo.taskPriority,
                date: editingTodo.taskDate,
              }}
              onSubmit={saveEdit}
              onCancel={cancelEdit}
              formError={error} // Pass global error to form if relevant
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TodoApp;