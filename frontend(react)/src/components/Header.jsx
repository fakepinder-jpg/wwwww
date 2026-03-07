import React from 'react';

const Header = ({ user, onNavigate, onLogout }) => {
  return (
    <header>
      <nav>
        <div className="logo" onClick={() => onNavigate(user ? 'dashboard' : 'home')}>
          TASKIFY
        </div>
        <button
          className="nav-btn"
          onClick={user ? onLogout : () => onNavigate('auth')}
        >
          {user ? 'Se déconnecter' : 'Se connecter'}
        </button>
      </nav>
    </header>
  );
};

export default Header;
