import React from 'react';

const Footer = () => {
  const handleDeadLink = (e) => {
    e.preventDefault();
    window.location.href = '/index%20404%20error.html';
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Taskify</h3>
          <p>
            La solution de gestion de projets simple et efficace pour les équipes modernes.
            Organisez, collaborez et réussissez ensemble.
          </p>
        </div>
        <div className="footer-section">
          <h3>Produit</h3>
          <ul className="footer-links">
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>Fonctionnalités</a></li>
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>Tarifs</a></li>
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>Documentation</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Entreprise</h3>
          <ul className="footer-links">
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>À propos</a></li>
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>Contact</a></li>
            <li><a href="/index%20404%20error.html" onClick={handleDeadLink}>Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Taskify. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
