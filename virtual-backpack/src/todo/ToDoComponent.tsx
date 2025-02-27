import { useEffect, useId, useState } from 'react'
import reactLogo from './assets/react.svg'
import 'bootstrap/dist/css/bootstrap.css'
import ToDoForm from './components/ToDoForm'
import ToDo from './components/ToDo'
import { Button, Col, Container, Row, Stack } from 'react-bootstrap'
import React from 'react'
import ToDoWrapper from './components/ToDoWrapper'


function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const addTodo = (name: any, priority: any, date: any) => {
    const newTodos = [
      ...todos,
      { id: crypto.randomUUID(), taskName: name, taskPriority: priority, taskDate: date, completed: false, isEditing: false },
      // console.log(todos)
    ]
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  //for edit to do
  // const [show, setShow] = useState(false);
  // const handleShow = setShow(true);
  // const handleClose = setShow(false);
  
  useEffect(() => {
      const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      setTodos(savedTodos);
  }, []);

  const toggleComplete = id => {
    const newTodos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  const deleteTodo = id => {
      const newTodos = todos.filter(todo => todo.id !== id);
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  const editTodo = id => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo));
  }

  const editTask = (taskName, taskPriority, taskDate, id) => {
    const newTodos = todos.map(todo => todo.id === id ? {...todo, taskName, taskPriority, taskDate, isEditing: !todo.isEditing} : todo);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  return (
    <div className = "bg-secondary p-3 min-vw-100 min-vh-100 mx-auto container">
      <Stack className = "bg-secondary p-3 min-vw-98 mx-auto" direction="horizontal" gap={1}>
        <div className='mx-auto'><ToDoWrapper todos={todos} head = "Today" toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/></div>
        <div className='mx-auto'><ToDoWrapper todos={todos} head = "Upcoming" toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/></div>
        <div className='mx-auto'><ToDoWrapper todos={todos} head = "Missed" toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/></div>
      </Stack>
      <ToDoForm addTodo={addTodo}/>
    </div>
  );
}

export default App
