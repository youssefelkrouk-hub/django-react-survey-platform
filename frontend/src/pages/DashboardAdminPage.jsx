import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export const DashboardAdminPage = () => {
  const [data, setData] = useState({
    total_entreprises: 0,
    collectes_aujourdhui: 0,
    total_enqueteurs: 0,
    enqueteurs_actifs: 0,
    par_enqueteur: [],
    dernieres_collectes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('admin/dashboard/');
        setData(res.data);
      } catch (err) {
        setError('Impossible de charger le tableau de bord administrateur.');
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

  const exportUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/'}export-csv/`;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="bi bi-speedometer2 me-2"></i>Tableau de bord Administrateur
          </h1>
          <p className="text-muted mb-0">Vue globale sur l'activité des enquêteurs et les données collectées.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <a href={exportUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
            <i className="bi bi-download me-1"></i> Export CSV
          </a>
          <Link to="/admin/enqueteurs" className="btn btn-primary">
            <i className="bi bi-people-fill me-1"></i> Gérer les enquêteurs
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 alert-di-animated">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3 di-stagger-card" style={{ '--di-stagger-index': 0 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-1"><i className="bi bi-building"></i></div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 0 }}>{data.total_entreprises}</div>
                <div className="text-muted small">Entreprises collectées</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 di-stagger-card" style={{ '--di-stagger-index': 1 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-2"><i className="bi bi-calendar-day-fill"></i></div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 1 }}>{data.collectes_aujourdhui}</div>
                <div className="text-muted small">Collectes aujourd'hui</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 di-stagger-card" style={{ '--di-stagger-index': 2 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-3"><i className="bi bi-people-fill"></i></div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 2 }}>{data.total_enqueteurs}</div>
                <div className="text-muted small">Enquêteurs inscrits</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 di-stagger-card" style={{ '--di-stagger-index': 3 }}>
          <div className="card carte-stat p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icone-stat bg-icone-4"><i className="bi bi-person-check-fill"></i></div>
              <div>
                <div className="valeur-stat valeur-stat-animee" style={{ '--di-stagger-index': 3 }}>{data.enqueteurs_actifs}</div>
                <div className="text-muted small">Enquêteurs actifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="card carte-app h-100">
            <div className="card-header entete-carte d-flex justify-content-between align-items-center py-3">
              <span><i className="bi bi-bar-chart-fill me-1"></i> Collectes par enquêteur</span>
              <Link to="/admin/enqueteurs" className="btn btn-sm btn-outline-light text-white border-white">Gérer</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-app mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Enquêteur</th>
                      <th className="text-center">Statut</th>
                      <th className="text-end">Collectes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.par_enqueteur && data.par_enqueteur.length > 0 ? (
                      data.par_enqueteur.map((u, idx) => (
                        <tr key={u.id} className="di-row-animate" style={{ '--di-stagger-index': Math.min(idx, 10) }}>
                          <td>
                            <div className="fw-semibold">{u.full_name}</div>
                            <small className="text-muted">{u.email}</small>
                          </td>
                          <td className="text-center">
                            {u.is_active ? (
                              <span className="badge bg-success">Actif</span>
                            ) : (
                              <span className="badge bg-secondary">Inactif</span>
                            )}
                          </td>
                          <td className="text-end fw-bold text-primary fs-5">{u.nb_collectes}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">Aucun enquêteur enregistré.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card carte-app h-100">
            <div className="card-header entete-carte py-3">
              <i className="bi bi-clock-history me-1"></i> Dernières collectes enregistrées
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-app mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Ville</th>
                      <th>Enquêteur</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dernieres_collectes && data.dernieres_collectes.length > 0 ? (
                      data.dernieres_collectes.map((c, idx) => (
                        <tr key={c.id} className="di-row-animate" style={{ '--di-stagger-index': Math.min(idx, 10) }}>
                          <td>
                            <div className="fw-semibold">{c.nom_entreprise}</div>
                            <small className="text-muted">{c.secteur_nom || 'N/C'}</small>
                          </td>
                          <td><span className="badge bg-light text-dark border">{c.ville}</span></td>
                          <td>{c.enqueteur_nom}</td>
                          <td>{c.date_enquete}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">Aucune collecte enregistrée.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
