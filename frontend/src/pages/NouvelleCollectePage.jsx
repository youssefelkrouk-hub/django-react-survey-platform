import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const NouvelleCollectePage = () => {
  const navigate = useNavigate();

  const [secteurs, setSecteurs] = useState([]);
  const [typesActivite, setTypesActivite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nom_entreprise: '',
    secteur: '',
    type_activite: '',
    taille_effectif: '',
    adresse: '',
    ville: '',
    code_postal: '',
    telephone: '',
    email: '',
    site_web: '',
    date_enquete: new Date().toISOString().split('T')[0],
    observations: '',
  });

  useEffect(() => {
    const fetchReferentiels = async () => {
      try {
        const [secteursRes, typesRes] = await Promise.all([
          api.get('referentiels/secteurs/'),
          api.get('referentiels/types-activite/'),
        ]);
        setSecteurs(secteursRes.data.results || secteursRes.data);
        setTypesActivite(typesRes.data.results || typesRes.data);
      } catch (err) {
        setErrorMsg('Impossible de charger les listes de référence.');
      } finally {
        setLoading(false);
      }
    };
    fetchReferentiels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        secteur: formData.secteur ? parseInt(formData.secteur, 10) : null,
        type_activite: formData.type_activite ? parseInt(formData.type_activite, 10) : null,
        taille_effectif: formData.taille_effectif ? parseInt(formData.taille_effectif, 10) : null,
      };
      await api.post('collectes/', payload);
      setSuccessMsg('La collecte de données a été enregistrée avec succès.');
      setFormData({
        nom_entreprise: '',
        secteur: '',
        type_activite: '',
        taille_effectif: '',
        adresse: '',
        ville: '',
        code_postal: '',
        telephone: '',
        email: '',
        site_web: '',
        date_enquete: new Date().toISOString().split('T')[0],
        observations: '',
      });
      window.scrollTo(0, 0);
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.keys(errors)
          .map((k) => `${k}: ${Array.isArray(errors[k]) ? errors[k].join(', ') : errors[k]}`)
          .join(' | ');
        setErrorMsg(`Erreur de validation : ${messages}`);
      } else {
        setErrorMsg("Une erreur s'est produite lors de l'enregistrement.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 mb-1">
          <i className="bi bi-clipboard2-plus-fill me-2" style={{ color: 'var(--di-primaire)' }}></i>
          Nouvelle collecte de données
        </h1>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          Renseignez les informations de l'entreprise rencontrée sur le terrain.
          Les champs marqués <span className="text-danger fw-bold">*</span> sont obligatoires.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show alert-di-animated" role="alert">
          <i className="bi bi-check-circle-fill me-1"></i>
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show alert-di-animated" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      <div className="card carte-app">
        <div className="card-body p-3 p-md-4">
          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1 : Identification */}
            <h2 className="section-titre">
              <i className="bi bi-building me-1"></i> Identification de l'entreprise
            </h2>

            <div className="mb-3">
              <label className="form-label champ-obligatoire fw-semibold small" htmlFor="nom_entreprise">
                Raison sociale / Nom de l'entreprise
              </label>
              <input
                type="text"
                className="form-control"
                id="nom_entreprise"
                name="nom_entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                required
                placeholder="Ex: Atlas Tech"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold small" htmlFor="secteur">
                  Secteur d'activité
                </label>
                <select
                  className="form-select"
                  id="secteur"
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                >
                  <option value="">---------</option>
                  {secteurs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold small" htmlFor="type_activite">
                  Type d'activité
                </label>
                <select
                  className="form-select"
                  id="type_activite"
                  name="type_activite"
                  value={formData.type_activite}
                  onChange={handleChange}
                >
                  <option value="">---------</option>
                  {typesActivite.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="taille_effectif">
                Effectif (nombre d'employés)
              </label>
              <input
                type="number"
                className="form-control"
                id="taille_effectif"
                name="taille_effectif"
                value={formData.taille_effectif}
                onChange={handleChange}
                min="0"
                placeholder="Ex: 25"
              />
            </div>

            {/* Section 2 : Localisation */}
            <h2 className="section-titre">
              <i className="bi bi-geo-alt-fill me-1"></i> Localisation de l'entreprise
            </h2>

            <div className="mb-3">
              <label className="form-label champ-obligatoire fw-semibold small" htmlFor="adresse">
                Adresse complète
              </label>
              <input
                type="text"
                className="form-control"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
                placeholder="N° et Rue, quartier"
              />
            </div>

            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label champ-obligatoire fw-semibold small" htmlFor="ville">
                  Ville
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  placeholder="Casablanca, Rabat, Fès..."
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold small" htmlFor="code_postal">
                  Code postal
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  placeholder="20250"
                />
              </div>
            </div>

            {/* Section 3 : Coordonnées */}
            <h2 className="section-titre">
              <i className="bi bi-telephone-fill me-1"></i> Coordonnées de contact
            </h2>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold small" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold small" htmlFor="email">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@entreprise.ma"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" htmlFor="site_web">
                Site web
              </label>
              <input
                type="url"
                className="form-control"
                id="site_web"
                name="site_web"
                value={formData.site_web}
                onChange={handleChange}
                placeholder="https://exemple.ma"
              />
            </div>

            {/* Section 4 : Enquête terrain */}
            <h2 className="section-titre">
              <i className="bi bi-journal-text me-1"></i> Détails de l'enquête terrain
            </h2>

            <div className="mb-3">
              <label className="form-label champ-obligatoire fw-semibold small" htmlFor="date_enquete">
                Date de l'enquête terrain
              </label>
              <input
                type="date"
                className="form-control"
                id="date_enquete"
                name="date_enquete"
                value={formData.date_enquete}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small" htmlFor="observations">
                Observations de l'enquêteur terrain
              </label>
              <textarea
                className="form-control"
                id="observations"
                name="observations"
                rows="4"
                value={formData.observations}
                onChange={handleChange}
                maxLength="2000"
                placeholder="Renseignez le contexte, la disponibilité du répondant..."
              ></textarea>
              <div className="form-text text-muted" style={{ fontSize: '0.78rem' }}>
                Notez vos observations de rigueur statistique : contexte, fiabilité estimée des informations.
              </div>
            </div>

            <div className="d-grid mt-2">
              <button
                type="submit"
                className={`btn btn-primary py-2 ${submitting ? 'btn-di-loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="bi bi-check-circle-fill me-1"></i>
                )}
                {submitting ? 'Enregistrement en cours...' : 'Enregistrer la collecte de données'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
