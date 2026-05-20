import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // 🌟 State ديال أنيماسيون النجاح
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('ville', formData.ville);
    data.append('email', formData.email);
    data.append('telephone', formData.telephone);
    data.append('adresse', formData.adresse);
    data.append('ice', formData.ice);
    data.append('identifiant_fiscal', formData.identifiant_fiscal);
    data.append('patente', formData.patente);
    data.append('rc', formData.rc);
    if (logo) data.append('logo', logo);

    try {
      await axios.post('http://127.0.0.1:8000/api/clients', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // ✨ 1. كنطلعو العلامة الخضراء هي الأولى
      setShowSuccess(true);
      
      // ✨ 2. كنتسناو ثانية ونص عاد كنديوه لصفحة الجدول الموديرن
      setTimeout(() => {
        navigate('/clients/gestion'); 
      }, 1500);

    } catch (err) {
      console.error("Erreur lors de l'ajout du partenaire:", err);
      alert("Erreur lors de l'ajout du partenaire. Vérifiez les données.");
    }
  };

  return (
    <div className="p-4 w-100" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto position-relative overflow-hidden" style={{ maxWidth: '850px', backgroundColor: '#ffffff', minHeight: '500px' }}>
        
        {/* 🟢 الأنيماسيون الخضراء السحرية (Overlay) */}
        {showSuccess && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white animate-fade-in" style={{ zIndex: 10 }}>
            <div className="success-checkmark mb-3">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-1">Partenaire Enregistré !</h4>
            <p className="text-muted small">Redirection vers le panneau de gestion...</p>
          </div>
        )}

        {/* الكونتنت العادي ديال الفورم */}
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark m-0">Nouveau Partenaire Commercial</h3>
          <p className="text-muted small mt-1">Remplissez les informations fiscales réelles pour la génération automatique des factures</p>
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
            <div className="text-muted small mt-2" style={{ fontSize: '11px' }}>Logo de l'entreprise (JPG, PNG)</div>
          </div>

          {/* 🏢 Section 1: Informations Générales */}
          <h5 className="fw-bold text-primary border-bottom pb-2 mb-4" style={{ fontSize: '15px' }}>
            <i className="bi bi-info-circle me-2"></i> Identité de l'Entreprise
          </h5>
          
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Nom de l'entreprise <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="Ex: ISAG Agency" required
                     value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Ville <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="Ex: Casablanca" required
                     value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Email Professionnel</label>
              <input type="email" className="form-control rounded-3 py-2" placeholder="contact@entreprise.com"
                     value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Téléphone <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="05 22 XX XX XX" required
                     value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary">Adresse du Siège Social <span className="text-danger">*</span></label>
              <textarea className="form-control rounded-3 py-2" rows="2" placeholder="N°, Rue, Quartier, Ville" required
                        value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})}></textarea>
            </div>
          </div>

          {/* ⚖️ Section 2: Données Fiscales Marocaines */}
          <h5 className="fw-bold text-primary border-bottom pb-2 mb-4" style={{ fontSize: '15px' }}>
            <i className="bi bi-file-earmark-check me-2"></i> Identifiants Fiscaux Légaux (Maroc)
          </h5>

          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">N° I.C.E (Identifiant Commun de l'Entreprise) <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3 py-2 font-monospace" placeholder="15 chiffres (Ex: 001234567890123)" maxLength="15" required
                     value={formData.ice} onChange={e => setFormData({...formData, ice: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">I.F (Identifiant Fiscal)</label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="Ex: 40221475"
                     value={formData.identifiant_fiscal} onChange={e => setFormData({...formData, identifiant_fiscal: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">N° de Patente</label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="Ex: 36154820"
                     value={formData.patente} onChange={e => setFormData({...formData, patente: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">R.C (Registre de Commerce)</label>
              <input type="text" className="form-control rounded-3 py-2" placeholder="Ex: Casablanca 459122"
                     value={formData.rc} onChange={e => setFormData({...formData, rc: e.target.value})} />
            </div>
          </div>

          {/* 🔘 Form Actions */}
          <div className="d-flex align-items-center justify-content-end gap-3 border-top pt-4">
            <button type="button" className="btn btn-light px-4 py-2 rounded-pill fw-semibold border text-secondary" onClick={() => navigate('/clients/gestion')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm">
              Enregistrer le Client
            </button>
          </div>
        </form>
      </div>

      {/* 🎨 CSS الخاص بـ الأنيماسيون الدائرية الخضراء الفخمة */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* 👑 Success Checkmark Animation CSS */
        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }
        .success-checkmark .check-icon {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 4px solid #4BB543;
        }
        .success-checkmark .check-icon::before, .success-checkmark .check-icon::after {
          content: '';
          height: 100px;
          position: absolute;
          background: #ffffff;
          transform: rotate(-45deg);
        }
        .success-checkmark .check-icon .icon-line {
          height: 5px;
          background-color: #4BB543;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }
        .success-checkmark .check-icon .icon-line.line-tip {
          top: 46px;
          left: 14px;
          width: 25px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }
        .success-checkmark .check-icon .icon-line.line-long {
          top: 38px;
          right: 8px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }
        .success-checkmark .check-icon .icon-circle {
          top: -4px;
          left: -4px;
          z-index: 10;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid rgba(75, 181, 67, 0.2);
          box-sizing: content-box;
          position: absolute;
        }
        
        @keyframes icon-line-tip {
          0% { width: 0; left: 1px; top: 19px; }
          54% { width: 0; left: 1px; top: 19px; }
          70% { width: 50px; left: -8px; top: 37px; }
          84% { width: 17px; left: 21px; top: 48px; }
          100% { width: 25px; left: 14px; top: 46px; }
        }
        @keyframes icon-line-long {
          0% { width: 0; right: 46px; top: 54px; }
          65% { width: 0; right: 46px; top: 54px; }
          84% { width: 55px; right: 0px; top: 35px; }
          100% { width: 47px; right: 8px; top: 38px; }
        }
      `}</style>
    </div>
  );
};

export default AddClient;