// Sidebar.tsx
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SaveModule from '../Save/SaveModule';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className={`sidenav ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? '☰' : '✕'}
      </button>
      <div className="nav-links">
        <Link to="/notebook">
          <span className="nav-icon">📓</span>
          <span className="nav-text">Notebook</span>
        </Link>
        <Link to="/flashcards">
          <span className="nav-icon">🔖</span>
          <span className="nav-text">Flashcards</span>
        </Link>
        <Link to="/calendar">
          <span className="nav-icon">📅</span>
          <span className="nav-text">Calendar</span>
        </Link>
        <Link to="/todo">
          <span className="nav-icon">✅</span>
          <span className="nav-text">To-Do</span>
        </Link>
        <Link to="/id">
          <span className="nav-icon">🆔</span>
          <span className="nav-text">ID</span>
        </Link>
      </div>
      <div className="save-module-container">
        <SaveModule />
      </div>
    </div>
  );
}

export default Sidebar;