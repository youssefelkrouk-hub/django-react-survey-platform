import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export const DashboardEnqueteurPage = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    total_collectes: 0,
    collectes_aujourdhui: 0,
    dernieres_collectes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('enqueteur/dashboard/');
        setData(res.data);
      } catch (err) {
        setError('Impossible de charger le tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">
            Bonjour, <strong>{user?.first_name || user?.username}</strong> 👋
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--di-primaire)' }}></i>
            Enquêteur de terrain — Rigueur statistique Data Ingénierie
          </p>
        </div>
        <Link to="/enqueteur/nouvelle-collecte" className="btn btn-primary px-4">
          <i className="bi bi-clipboard2-plus-fill me-1"></i> Nouvelle collecte
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2 alert-di-animated">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 di-stagger-card" style={{ '--di-stagger-index': 0 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-1">
                <i className="bi bi-building"></i>
              </div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 0 }}>{data.total_collectes}</div>
                <div className="text-muted small">
                  Collectes de données
                  <br />
                  enregistrées
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 di-stagger-card" style={{ '--di-stagger-index': 1 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-2">
                <i className="bi bi-calendar-day-fill"></i>
              </div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 1 }}>{data.collectes_aujourdhui}</div>
                <div className="text-muted small">
                  Fiches saisies
                  <br />
                  aujourd'hui
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card carte-app">
        <div className="card-header entete-carte py-3">
          <i className="bi bi-clock-history me-1"></i> Mes dernières collectes de données
        </div>
        <div className="card-body p-0">
          {data.dernieres_collectes && data.dernieres_collectes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-app mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Ville</th>
                    <th>Secteur</th>
                    <th>Date d'enquête</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dernieres_collectes.map((c, idx) => (
                    <tr key={c.id} className="di-row-animate" style={{ '--di-stagger-index': Math.min(idx, 10) }}>
                      <td>
                        <span className="fw-semibold">{c.nom_entreprise}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{c.ville}</span>
                      </td>
                      <td>{c.secteur_nom || '—'}</td>
                      <td>{c.date_enquete}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i
                className="bi bi-clipboard2-x fs-2 d-block mb-2"
                style={{ color: 'var(--di-primaire)', opacity: 0.4 }}
              ></i>
              <p className="mb-2">Aucune collecte de données enregistrée pour le moment.</p>
              <Link to="/enqueteur/nouvelle-collecte" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>Commencer la collecte terrain
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
