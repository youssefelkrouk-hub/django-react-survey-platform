import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export const MesCollectesPage = () => {
  const [collectes, setCollectes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCollectes = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get(`collectes/?q=${encodeURIComponent(q)}`);
      setCollectes(res.data.results || res.data);
    } catch (err) {
      setError('Impossible de charger la liste des collectes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectes();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCollectes(search);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="bi bi-list-check me-2" style={{ color: 'var(--di-primaire)' }}></i>
            Mes collectes de données
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Historique de votre activité d'enquêteur terrain
          </p>
        </div>
        <Link to="/enqueteur/nouvelle-collecte" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Nouvelle collecte
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white" style={{ borderColor: 'var(--di-bordure)' }}>
            <i className="bi bi-search" style={{ color: 'var(--di-primaire)' }}></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher une entreprise ou une ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            Rechercher
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger py-2 alert-di-animated">{error}</div>}

      <div className="card carte-app">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : collectes && collectes.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-app mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Ville</th>
                      <th>Secteur d'activité</th>
                      <th>Téléphone</th>
                      <th>Date d'enquête</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectes.map((c, idx) => (
                      <tr key={c.id} className="di-row-animate" style={{ '--di-stagger-index': Math.min(idx, 10) }}>
                        <td><span className="fw-semibold">{c.nom_entreprise}</span></td>
                        <td><span className="badge bg-light text-dark border">{c.ville}</span></td>
                        <td>{c.secteur_nom || '—'}</td>
                        <td>{c.telephone || '—'}</td>
                        <td>{c.date_enquete}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2 text-muted small border-top d-flex justify-content-between">
                <span>
                  <i className="bi bi-info-circle me-1"></i>
                  {collectes.length} collecte(s) de données trouvée(s)
                  {search && ` pour « ${search} »`}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-5 text-muted">
              <i
                className="bi bi-clipboard2-x fs-2 d-block mb-2"
                style={{ color: 'var(--di-primaire)', opacity: 0.4 }}
              ></i>
              {search ? (
                <>
                  <p>Aucune collecte trouvée pour « <strong>{search}</strong> ».</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearch(''); fetchCollectes(''); }}>
                    Voir toutes les collectes
                  </button>
                </>
              ) : (
                <>
                  <p>Aucune collecte de données enregistrée.</p>
                  <Link to="/enqueteur/nouvelle-collecte" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1"></i> Commencer la collecte terrain
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
