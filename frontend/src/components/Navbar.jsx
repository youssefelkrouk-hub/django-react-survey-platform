import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo-data-ingenierie.png';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDarkNavbar = true;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container-fluid px-3">
        {/* Logo réel Data Ingénierie (40px) */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src={logoImg}
            alt="Data Ingénierie"
            height="40"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu-principal"
          aria-label="Ouvrir le menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu-principal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user.role === 'admin' ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Tableau de bord
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/'}export-csv/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-download me-1"></i>Export CSV
                  </a>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/enqueteurs">
                    <i className="bi bi-people-fill me-1"></i>Enquêteurs de terrain
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/enqueteur/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Tableau de bord
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/enqueteur/nouvelle-collecte">
                    <i className="bi bi-clipboard2-plus-fill me-1"></i>Nouvelle collecte
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/enqueteur/mes-collectes">
                    <i className="bi bi-list-check me-1"></i>Mes collectes de données
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                href="#profile"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle"></i>
                <span>{user.first_name || user.username}</span>
                <span className="badge bg-light text-primary ms-1" style={{ fontSize: '0.65rem' }}>
                  {user.role === 'admin' ? 'Admin' : 'Enquêteur'}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <span className="dropdown-item-text text-muted small py-1">
                    {user.full_name || user.username}
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider my-1" />
                </li>
                <li>
                  <button className="dropdown-item text-danger border-0 bg-transparent" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Déconnexion
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
