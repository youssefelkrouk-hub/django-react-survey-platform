import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo-data-ingenierie.png';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const userData = await login(username, password);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/enqueteur/dashboard');
      }
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-connexion">
      <div className="carte-connexion mx-auto">
        {/* Logo réel Data Ingénierie (70px) */}
        <div className="text-center mb-4">
          <img
            src={logoImg}
            alt="Data Ingénierie"
            height="70"
            className="mb-3"
            style={{ display: 'block', margin: '0 auto' }}
          />
          <p className="text-muted small mb-0">Plateforme de collecte de données terrain</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3 alert-di-animated">
            <i className="bi bi-exclamation-triangle-fill me-1"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold small" htmlFor="username">
              Nom d'utilisateur
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-person" style={{ color: 'var(--di-primaire)' }}></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Votre identifiant"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small" htmlFor="password">
              Mot de passe
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-lock" style={{ color: 'var(--di-primaire)' }}></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-100 py-2 ${submitting ? 'btn-di-loading' : ''}`}
            disabled={submitting}
          >
            {submitting ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : (
              <i className="bi bi-box-arrow-in-right me-1"></i>
            )}
            {submitting ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center text-muted" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-shield-check me-1" style={{ color: 'var(--di-primaire)' }}></i>
          Accès réservé aux enquêteurs de terrain agréés
        </p>
      </div>
    </div>
  );
};
