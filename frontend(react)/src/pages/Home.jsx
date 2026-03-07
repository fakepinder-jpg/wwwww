import React from 'react';
import Footer from '../components/Footer';

const Home = ({ onNavigate }) => {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Organisez vos projets <span>simplement</span>
          </h1>
          <p>
            Taskify vous permez de gérer vos tâches, collaborer avec votre équipe
            et suivre l'avancement de vos projets en temps réel.
          </p>
          <button className="cta-btn" onClick={() => onNavigate('auth')}>
            Commencer gratuitement
          </button>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <h4>À faire</h4>
            <div className="visual-item">Concevoir la maquette</div>
            <div className="visual-item">Créer la base de données</div>
          </div>
          <div className="visual-card">
            <h4>En cours</h4>
            <div className="visual-item">Développer le frontend</div>
            <div className="visual-item">Tests utilisateurs</div>
          </div>
          <div className="visual-card">
            <h4>Terminé</h4>
            <div className="visual-item">Recherche utilisateur</div>
            <div className="visual-item">Wireframes</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="M80-200v-80h400v80H80Zm0-200v-80h200v80H80Zm0-200v-80h200v80H80Zm744 400L670-354q-24 17-52.5 25.5T560-320q-83 0-141.5-58.5T360-520q0-83 58.5-141.5T560-720q83 0 141.5 58.5T760-520q0 29-8.5 57.5T726-410l154 154-56 56ZM560-400q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/></svg></div>
            <h3>Tableaux flexibles</h3>
            <p>
              est un tableau interactif et modifiable en temps réel, qui s'adapte à l'organisation du travail.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg></div>
            <h3>Colonnes personnalisables</h3>
            <p>
              sont des colonnes que l'on peut configurer et adapter pour organiser son travail comme on le souhaite.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z"/></svg></div>
            <h3>Interface intuitive</h3>
            <p>
              est une interface simple, claire et facile à utiliser dès la première prise en main.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
