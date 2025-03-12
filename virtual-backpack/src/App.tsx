import {BrowserRouter} from "react-router-dom"
import './App.css'
import Sidebar from './components/Sidebar/Sidebar.tsx'
import NotesApp from "./components/Notebook/NoteApp.tsx"
import ToDoApp from "./components/todo/ToDoComponent.tsx"
import Calendar from "./components/Calendar/Calendar.tsx"
import CalendarApp from "./components/Calendar/CalendarApp.tsx"

function App() {
  return (
    <>
      <Sidebar></Sidebar>
      <CalendarApp/>
    </>
  )
}

export default App
