import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import backpack from "../../assets/backpack.png";

const Homepage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  return (
    <div className={`page page${page}`}>
      {/* PAGE 1 - Landing Page */}
      {page === 1 && (
        <div className="page1">
          <div className="landing-content">
            <button onClick={() => setPage(2)} className="backpack-btn">
              <img src={backpack} alt="Virtual Backpack" className="backpack-img" />
            </button>
            <h1 className="title">Virtual Backpack</h1>
            <button 
              className="tutorial-btn"
              onClick={() => setPage(3)}
            >
              How to Use
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2 - App Selection */}
      {page === 2 && (
        <div className="page2">
          <div className="backpack-container">
            <h2 className="app-grid-title">Open an App:</h2>
            <div className="app-grid">
              <button className="app-btn" onClick={() => navigate("/notes")}>
                <span className="app-icon">📓</span>
                Notebook
              </button>
              <button className="app-btn" onClick={() => navigate("/todo")}>
                <span className="app-icon">✅</span>
                To-Do List
              </button>
              <button className="app-btn" onClick={() => navigate("/calendar")}>
                <span className="app-icon">📅</span>
                Calendar
              </button>
              <button className="app-btn" onClick={() => navigate("/flashcards")}>
                <span className="app-icon">🔖</span>
                Flashcards
              </button>
              <button className="app-btn" onClick={() => navigate("/id")}>
                <span className="app-icon">🆔</span>
                Student ID
              </button>
            </div>
            <button 
              className="back-btn"
              onClick={() => setPage(1)}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* PAGE 3 - Tutorial */}
      {page === 3 && (
        <div className="page3">
          <div className="header">
            <h2 className="header-title">Virtual Backpack Guide</h2>
            <button onClick={() => setPage(1)} className="back-btn">⬅</button>
          </div>
          <div className="content">
            <h3 className="section-title">Getting Started</h3>
            <p className="content-text">
              Welcome to your Virtual Backpack! This is your all-in-one digital companion for school organization. Click the backpack icon to access all your tools.
            </p>
            
            <h3 className="section-title">Available Features</h3>
            <div className="grid-container">
              <div className="grid-item">
                <h4>Notes</h4>
                <p>Take and organize class notes with rich text formatting. Create multiple notebooks for different subjects.</p>
              </div>
              <div className="grid-item">
                <h4>Personal ID</h4>
                <p>Store your student information for quick access. Keep your ID details handy whenever you need them.</p>
              </div>
              <div className="grid-item">
                <h4>Scheduler</h4>
                <p>Track classes, assignments, and important dates. Set reminders for upcoming deadlines.</p>
              </div>
              <div className="grid-item">
                <h4>To-do List</h4>
                <p>Manage tasks and assignments with due dates. Mark items as complete when finished.</p>
              </div>
              <div className="grid-item">
                <h4>Flashcards</h4>
                <p>Create digital flashcards for studying. Organize by subject and track your learning progress.</p>
              </div>
            </div>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;