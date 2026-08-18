import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export const GestionEnqueteursPage = () => {
  const [enqueteurs, setEnqueteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchEnqueteurs = async () => {
    setLoading(true);
    try {
      const res = await api.get('admin/enqueteurs/');
      setEnqueteurs(res.data.results || res.data);
    } catch (err) {
      setError('Impossible de charger la liste des enquêteurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnqueteurs();
  }, []);

  const toggleActive = async (enqueteur) => {
    try {
      await api.patch(`admin/enqueteurs/${enqueteur.id}/`, {
        is_active: !enqueteur.is_active,
      });
      fetchEnqueteurs();
    } catch (err) {
      alert("Erreur lors de la modification du statut de l'enquêteur.");
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      await api.post('admin/enqueteurs/', formData);
      setShowModal(false);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        telephone: '',
        password: '',
      });
      fetchEnqueteurs();
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        const msg = Object.keys(errors)
          .map((k) => `${k}: ${Array.isArray(errors[k]) ? errors[k].join(', ') : errors[k]}`)
          .join(' | ');
        setModalError(msg);
      } else {
        setModalError("Erreur lors de la création de l'enquêteur.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="bi bi-people-fill me-2" style={{ color: 'var(--di-primaire)' }}></i>
            Gestion des enquêteurs de terrain
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Ajoutez, activez ou désactivez les comptes des enquêteurs statistiques Data Ingénierie.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill me-1"></i> Ajouter un enquêteur
        </button>
      </div>

      {error && <div className="alert alert-danger py-2 alert-di-animated">{error}</div>}

      <div className="card carte-app">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-app mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Identifiant</th>
                    <th>Nom & Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th className="text-center">Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enqueteurs.map((u, idx) => (
                    <tr key={u.id} className="di-row-animate" style={{ '--di-stagger-index': Math.min(idx, 10) }}>
                      <td className="fw-semibold">{u.username}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.telephone || '—'}</td>
                      <td className="text-center">
                        {u.is_active ? (
                          <span className="badge bg-success">Actif</span>
                        ) : (
                          <span className="badge bg-secondary">Désactivé</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className={`btn btn-sm ${u.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => toggleActive(u)}
                        >
                          {u.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout d'un enquêteur */}
      {showModal && (
        <div className="modal show d-block modal-di-backdrop" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content modal-di-content" style={{ borderRadius: 'var(--di-radius)' }}>
              <div className="modal-header text-white" style={{ background: 'var(--di-primaire)', borderRadius: 'var(--di-radius) var(--di-radius) 0 0' }}>
                <h5 className="modal-title">Ajouter un enquêteur de terrain</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleModalSubmit}>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger py-2 small alert-di-animated">{modalError}</div>}
                  <div className="mb-3">
                    <label className="form-label champ-obligatoire small fw-semibold">Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Prénom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Adresse Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Téléphone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="06XXXXXXXX"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Par défaut: Enquete123!"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className={`btn btn-primary ${submitting ? 'btn-di-loading' : ''}`} disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Création...
                      </>
                    ) : (
                      'Créer le compte'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
