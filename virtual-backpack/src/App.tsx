import {BrowserRouter} from "react-router-dom"
import './App.css'
import Sidebar from './components/Sidebar/Sidebar.tsx'
import NotesApp from "./components/Notebook/NoteApp.tsx"

function App() {
  return (
    <>
      <Sidebar></Sidebar>
      <BrowserRouter>
        <NotesApp />
      </BrowserRouter>
    </>
  )
}

export default App
