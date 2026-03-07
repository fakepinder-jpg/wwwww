import React, { useState } from 'react';
import strapiService from '../services/strapi';

const Auth = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    setConfirmError('');

    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setConfirmError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await strapiService.register(email, password);
      } else {
        response = await strapiService.login(email, password);
      }

      if (response && response.user) {
        onLogin(response.user);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isSignup ? 'Inscription' : 'Connexion'}</h2>
          <p>{isSignup ? 'Créez votre compte' : 'Connectez-vous à votre compte'}</p>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#FEE2E2',
              border: '2px solid var(--primary)',
              marginBottom: '1rem',
              color: 'var(--primary)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              {passwordError && <div className="error-msg">{passwordError}</div>}
            </div>

            {isSignup && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                {confirmError && <div className="error-msg">{confirmError}</div>}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Chargement...' : (isSignup ? 'S\'inscrire' : 'Se connecter')}
            </button>
          </form>

          <div className="auth-toggle">
            <span>{isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}</span>
            <button onClick={() => setIsSignup(!isSignup)} disabled={loading}>
              {isSignup ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
