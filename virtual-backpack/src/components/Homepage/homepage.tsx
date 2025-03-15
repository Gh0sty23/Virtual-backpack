import { useState } from "react";
import {useNavigate} from "react-router-dom";
import "./App.css";

const Homepage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate()

  return (
    <div className={`page page-${page}`}>
      {/* PAGE 1 */}
      {page === 1 && (
        <div className="page1">
          <button onClick={() => setPage(2)} className="backpack-btn">
            <img src="/backpack.png" alt="Virtual Backpack" className="backpack-img" />
          </button>
          <h1 className="title">Virtual Backpack</h1>
        </div>
      )}

     
      {page === 2 && (
        <div className="page2">
          <h2>Open an App:</h2>
          <button className="nav-btn" onClick={() => navigate("/notes")}>📒 Open Notebook</button>
          <button className="nav-btn" onClick={() => navigate("/todo")}>✅ Open To-Do List</button>
          <button className="nav-btn" onClick={() => navigate("/calendar")}>📒 Open Notebook</button>
          <button className="nav-btn" onClick={() => navigate("/flashcards")}>✅ Open To-Do List</button>
          <button className="nav-btn" onClick={() => navigate("/id")}>✅ Open To-Do List</button>
          <button className="nav-btn" onClick={() => setPage(3)}>📖 Tutorial</button>
        </div>
      )}

      {/* PAGE 3 */}
      {page === 3 && (
        <div className="page3">
          <div className="header">
            <h2 className="header-title">Virtual Backpack Guide</h2>
            <button onClick={() => setPage(1)} className="back-btn">⬅</button>
          </div>
          <div className="content">
            <h3 className="section-title">Open Your Backpack</h3>
            <p className="content-text">
              openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open openopen open open
            </p>
          </div>
          <div className="grid-container">
            <div className="grid-item">Notes</div>
            <div className="grid-item">Personal ID</div>
            <div className="grid-item">Scheduler</div>
            <div className="grid-item">To-do List</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
