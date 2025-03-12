import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Sidebar from './components/Sidebar/Sidebar.tsx'
import NotesApp from "./components/Notebook/NoteApp.tsx"
import ToDoApp from "./components/todo/ToDoComponent.tsx"
import Calendar from "./components/Calendar/Calendar.tsx"
import CalendarApp from "./components/Calendar/CalendarApp.tsx"

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/notebook" element={<NotesApp />} />
            <Route path="/flashcards" element={<div>Flashcards Content</div>} />
            <Route path="/calendar" element={<CalendarApp />} />
            <Route path="/todo" element={<ToDoApp />} />
            <Route path="/id" element={<div>ID Content</div>} />
            <Route path="/" element={<CalendarApp />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App