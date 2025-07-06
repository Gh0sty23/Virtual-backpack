
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SaveModule from '../Save/SaveModule'

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(prev => !prev)
  }

  return (
    <>
      <div className={`sidenav ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? '☰' : '✖'}
        </button>
        <Link to="/notebook">Notebook</Link>
        <Link to="/flashcards">Flashcards</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/todo">To-Do list</Link>
        <Link to="/id">ID</Link>
        <div style={{ marginTop: '2rem' }}>
          <SaveModule />
        </div>
      </div>
    </>
  );
}

export default Sidebar
