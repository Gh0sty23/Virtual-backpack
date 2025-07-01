import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import ToDoForm from './ToDoForm'
import {Stack } from 'react-bootstrap'
import ToDoWrapper from './ToDoWrapper'
import Sidebar from '../Sidebar/Sidebar'
import EditToDoForm from './EditToDoForm';



function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const addTodo = (name: any, priority: any, date: any) => {
    const newTodos = [
      ...todos,
      { id: crypto.randomUUID(), taskName: name, taskPriority: priority, taskDate: date, completed: false },
    ];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const editTask = (taskName: any, taskPriority: any, taskDate: any, id: any) => {
    const newTodos = todos.map(todo => todo.id === id ? { ...todo, taskName, taskPriority, taskDate } : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')!) || [];
    setTodos(savedTodos);
  }, []);

  const toggleComplete = (id: any) => {
    const newTodos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const deleteTodo = (id: any) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const editTodo = (id: any) => {
    const taskToEdit = todos.find(todo => todo.id === id);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setShowEditModal(true);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-3 w-100 h-100 container">
        <Stack className="p-3 w-100" direction="horizontal" gap={5}>
          <div className="mx-auto">
            <ToDoWrapper todos={todos} head="Today" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
          </div>
          <div className="mx-auto">
            <ToDoWrapper todos={todos} head="Upcoming" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
          </div>
          <div className="mx-auto">
            <ToDoWrapper todos={todos} head="Missed" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
          </div>
        </Stack>
        <ToDoForm addTodo={addTodo} />
      </div>

      {selectedTask && (
        <EditToDoForm
          editTask={editTask}
          editTodo={editTodo}
          task={selectedTask}
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}


export default App
