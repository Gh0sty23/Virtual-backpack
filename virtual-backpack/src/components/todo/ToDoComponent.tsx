import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import ToDoForm from './ToDoForm'
import { Stack } from 'react-bootstrap'
import ToDoWrapper from './ToDoWrapper'
import Sidebar from '../Sidebar/Sidebar'


function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const addTodo = (name: any, priority: any, date: any) => {
    name.trim();
    const newTodos = [
      ...todos,
      { id: crypto.randomUUID(), taskName: name, taskPriority: priority, taskDate: date, completed: false, isEditing: false },
      // console.log(todos)
    ]
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }
  const editTask = (taskName: any, taskPriority: any, taskDate: any, id: any) => {
    const newTodos = todos.map(todo => todo.id === id ? { ...todo, taskName, taskPriority, taskDate, isEditing: !todo.isEditing } : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }
  //for edit to do
  // const [show, setShow] = useState(false);
  // const handleShow = setShow(true);
  // const handleClose = setShow(false);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')!) || [];
    setTodos(savedTodos);
  }, []);

  const toggleComplete = (id: any) => {
    const newTodos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  const deleteTodo = (id: any) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  const editTodo = (id: any) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo));
  }



  return (
    <>
      <Sidebar /> {/*renders the sidebar. I cannot be assed to figure out a modular way to conditionally code this shit*/}
      <div className="p-3 w-100 h-100 container">
        <Stack className="p-3 w-100" direction="horizontal" gap={5}>
          <div className='mx-auto'><ToDoWrapper todos={todos} head="Today" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} /></div>
          <div className='mx-auto'><ToDoWrapper todos={todos} head="Upcoming" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} /></div>
          <div className='mx-auto'><ToDoWrapper todos={todos} head="Missed" toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} /></div>
        </Stack>
        <ToDoForm addTodo={addTodo} />
      </div>
    </>
  );
}

export default App
