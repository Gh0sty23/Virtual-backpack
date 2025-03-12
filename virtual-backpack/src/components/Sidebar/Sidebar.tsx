import './Sidebar.css'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <>
      <div className="sidenav">
        <Link to="/notebook">Notebook</Link>
        <Link to="/flashcards">Flashcards</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/todo">To-Do list</Link>
        <Link to="/id">ID</Link>
      </div>
    </>
  );
}

export default Sidebar