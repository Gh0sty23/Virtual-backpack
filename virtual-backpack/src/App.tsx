import {BrowserRouter} from "react-router-dom"
import './App.css'
import Sidebar from './components/Sidebar/Sidebar.tsx'
import NotesApp from "./components/Notebook/NoteApp.tsx"
import ToDoApp from "./components/todo/ToDoComponent.tsx"

function App() {
  return (
    <>
      <Sidebar></Sidebar>
      <ToDoApp/>
    </>
  )
}

export default App
