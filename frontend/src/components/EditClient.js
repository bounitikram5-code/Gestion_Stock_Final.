import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    email: '',
    telephone: '',
    adresse: '',         
    ice: '',             
    identifiant_fiscal: '', 
    patente: '',         
    rc: ''               
  });

  const API_BASE_URL = "http://127.0.0.1:8000";

  // 1. Kan-jibou l-m3loumat dyal l-client l-9dim
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/clients/${id}`)
      .then(res => {
        const d = res.data;
        if (d) {
          setFormData({
            nom: d.nom || '',
            ville: d.ville || '',
            email: d.email || '',
            telephone: d.telephone || '',
            adresse: d.adresse || '',
            ice: d.ice || '',
            identifiant_fiscal: d.identifiant_fiscal || '',
            patente: d.patente || '',
            rc: d.rc || ''
          });
          if (d.logo) {
            setLogoPreview(`${API_BASE_URL}/storage/${d.logo}`);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement du client:", err);
        setError("Impossible de charger les données du client.");
        setLoading(false);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // 2. Traitement dyal Formulaire Modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    // ⚠️ Hada darori f Laravel bach i-fhem bli rahaa Modification (PUT) wakha n-siftoha b POST
    data.append('_method', 'PUT'); 
    
    data.append('nom', formData.nom);
    data.append('ville', formData.ville);
    data.append('email', formData.email || '');
    data.append('telephone', formData.telephone);
    data.append('adresse', formData.adresse);
    data.append('ice', formData.ice);
    data.append('identifiant_fiscal', formData.identifiant_fiscal || '');
    data.append('patente', formData.patente || '');
    data.append('rc', formData.rc || '');
    
    if (logo) {
      data.append('logo', logo);
    }

    try {
      // Kan-sifto b POST walakin 3ndna _method = PUT f l-FormData
      await axios.post(`${API_BASE_URL}/api/clients/${id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      // ✨ Redirection s-shiha l l-panneau d'administration dyalk
      navigate('/clients/gestion'); 
    } catch (err) {
      console.error("Erreur lors de la modification:", err.response ? err.response.data : err);
      alert("Erreur lors de la modification du partenaire. Vérifiez les champs.");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-5 text-center" role="alert">
      {error} <br />
      {/* ✨ Redirection hna hta hiya l l-page s-shiha */}
      <button className="btn btn-outline-danger btn-sm mt-3" onClick={() => navigate('/clients/gestion')}>Retour</button>
    </div>
  );

  return (
    <div className="p-4 w-100" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: '850px', backgroundColor: '#ffffff' }}>
        
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark m-0">Modifier le Partenaire Commercial</h3>
          <p className="text-muted small mt-1">Mettez à jour les informations légales et coordonnées de l'entreprise</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 📸 Upload Section dyal l-Logo */}
          <div className="text-center mb-5">
            <div className="position-relative d-inline-block">
              <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden shadow-xs" 
                   style={{ width: '100px', height: '100px', borderColor: '#E2E8F0' }}>
                {logoPreview ? (
                  <img src={logoPreview} className="w-100 h-100 object-fit-cover" alt="Preview" />
                ) : (
                  <i className="bi bi-building fs-2 text-muted"></i>
                )}
              </div>
              <label htmlFor="logo-upload" className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 shadow" 
                     style={{ width: '30px', height: '30px', cursor: 'pointer' }}>
                <i className="bi bi-camera-fill small"></i>
              </label>
              <input id="logo-upload" type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
            </div>
            <div className="text-muted small mt-2" style={{ fontSize: '11px' }}>Modifier le Logo</div>
          </div>

          {/* 🏢 Section 1: Informations Générales */}
          <h5 className="fw-bold text-primary border-bottom pb-2 mb-4" style={{ fontSize: '15px' }}>
            <i className="bi bi-info-circle me-2"></i> Identité de l'Entreprise
          </h5>
          
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Nom de l'entreprise <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" required
                     value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Ville <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" required
                     value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Email Professionnel</label>
              <input type="email" className="form-control rounded-3 py-2"
                     value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Téléphone <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" required
                     value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary">Adresse du Siège Social <span className="text-danger">*</span></label>
              <textarea className="form-control rounded-3 py-2" rows="2" required
                        value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})}></textarea>
            </div>
          </div>

          {/* ⚖️ Section 2: Données Fiscales Marocaines */}
          <h5 className="fw-bold text-primary border-bottom pb-2 mb-4" style={{ fontSize: '15px' }}>
            <i className="bi bi-file-earmark-check me-2"></i> Identifiants Fiscaux Légaux (Maroc)
          </h5>

          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">N° I.C.E <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2 font-monospace" maxLength="15" required
                     value={formData.ice} onChange={e => setFormData({...formData, ice: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">I.F (Identifiant Fiscal)</label>
              <input type="text" className="form-control rounded-3 py-2"
                     value={formData.identifiant_fiscal} onChange={e => setFormData({...formData, identifiant_fiscal: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">N° de Patente</label>
              <input type="text" className="form-control rounded-3 py-2"
                     value={formData.patente} onChange={e => setFormData({...formData, patente: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">R.C (Registre de Commerce)</label>
              <input type="text" className="form-control rounded-3 py-2"
                     value={formData.rc} onChange={e => setFormData({...formData, rc: e.target.value})} />
            </div>
          </div>

          {/* 🔘 Form Actions */}
          <div className="d-flex align-items-center justify-content-end gap-3 border-top pt-4">
            {/* ✨ Hna hta f Annuler ghadi yrj3ek nishan l s-sfha s-shiha */}
            <button type="button" className="btn btn-light px-4 py-2 rounded-pill fw-semibold border text-secondary" onClick={() => navigate('/clients/gestion')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm">
              Mettre à jour
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditClient;