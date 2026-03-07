import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import strapiService from './services/strapi';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(() => strapiService.getCurrentUser() || null);

  const [currentPage, setCurrentPage] = useState(() =>
    strapiService.getCurrentUser() && strapiService.isAuthenticated() ? 'dashboard' : 'home'
  );

  const [currentBoard, setCurrentBoard] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    strapiService.logout();
    setUser(null);
    setCurrentBoard(null);
    setCurrentPage('home');
  };

  const handleOpenBoard = (board) => {
    setCurrentBoard(board);
    setCurrentPage('board');
  };

  const handleBackToDashboard = () => {
    setCurrentBoard(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      <Header
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && (
        <Home onNavigate={handleNavigate} />
      )}

      {currentPage === 'auth' && (
        <Auth onLogin={handleLogin} />
      )}

      {currentPage === 'dashboard' && user && (
        <Dashboard
          onNavigate={handleNavigate}
          onOpenBoard={handleOpenBoard}
        />
      )}

      {currentPage === 'board' && currentBoard && (
        <BoardView
          board={currentBoard}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
