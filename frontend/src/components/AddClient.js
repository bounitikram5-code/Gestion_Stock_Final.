import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    email: '',
    telephone: '',
    adresse: '',
    ice: '',
    identifiant_fiscal: '',
    patente: '',
    rc: '',
    password: '', 
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

    const token = localStorage.getItem('token');
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });
    if (logo) data.append('logo', logo);

    try {
      await axios.post('http://127.0.0.1:8000/api/clients', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      setShowSuccess(true);
      setTimeout(() => navigate('/clients/gestion'), 1500);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'ajout du partenaire.");
    }
  };

  const inputStyle = {
    borderRadius: 10,
    border: '1.5px solid #E4EAF6',
    padding: '10px 14px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#F7F9FF',
    color: '#0F172A',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ backgroundColor: '#F0F4FF', minHeight: '100vh', padding: 'clamp(16px,4vw,32px)', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 860, margin: '0 auto', background: '#fff', borderRadius: 20, border: '1.5px solid #E4EAF6', boxShadow: '0 4px 24px rgba(37,99,235,0.08)', padding: 'clamp(20px,5vw,40px)', position: 'relative', overflow: 'hidden' }}>

        
        {showSuccess && (
          <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', border: '3px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Partenaire enregistré!</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Compte client créé avec succès</div>
          </div>
        )}

      
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px', letterSpacing: -0.4 }}>Nouveau Partenaire Commercial</h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Remplissez les informations — un compte client sera créé automatiquement</p>
        </div>

        <form onSubmit={handleSubmit}>

          
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#F0F4FF', border: '2px solid #E4EAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {logoPreview
                  ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                }
              </div>
              <label htmlFor="logo-upload" style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#2563EB', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </label>
              <input id="logo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>Logo de l'entreprise (optionnel)</div>
          </div>

         
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 14, paddingBottom: 8, borderBottom: '1.5px solid #E4EAF6' }}>
            Identité de l'entreprise
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Nom de l\'entreprise *', key: 'nom', placeholder: 'Ex: ISAG Agency', required: true },
              { label: 'Ville *', key: 'ville', placeholder: 'Ex: Casablanca', required: true },
              { label: 'Email professionnel', key: 'email', placeholder: 'contact@entreprise.com', type: 'email' },
              { label: 'Téléphone *', key: 'telephone', placeholder: '05 22 XX XX XX', required: true },
            ].map(({ label, key, placeholder, required, type }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type || 'text'}
                  placeholder={placeholder}
                  required={required}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E4EAF6'}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Adresse du siège social *</label>
              <textarea
                placeholder="N°, Rue, Quartier, Ville"
                required
                rows={2}
                value={formData.adresse}
                onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E4EAF6'}
              />
            </div>
          </div>

          
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 14, paddingBottom: 8, borderBottom: '1.5px solid #E4EAF6' }}>
            Identifiants fiscaux
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'N° I.C.E *', key: 'ice', placeholder: '15 chiffres', required: true, maxLength: 15 },
              { label: 'Identifiant fiscal', key: 'identifiant_fiscal', placeholder: 'Ex: 40221475' },
              { label: 'N° de patente', key: 'patente', placeholder: 'Ex: 36154820' },
              { label: 'R.C (Registre de commerce)', key: 'rc', placeholder: 'Ex: Casablanca 459122' },
            ].map(({ label, key, placeholder, required, maxLength }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  required={required}
                  maxLength={maxLength}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E4EAF6'}
                />
              </div>
            ))}
          </div>

         
          <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 14, paddingBottom: 8, borderBottom: '1.5px solid #E4EAF6' }}>
            Compte d'accès client
          </div>

          <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#065F46', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              Le client va se connecter avec son <strong>email professionnel</strong> et le mot de passe que vous définissez ci-dessous. Il verra uniquement son stock et ses articles.
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Mot de passe du compte client *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 8 caractères"
                required
                minLength={8}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#E4EAF6'}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPwd
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>
              Communiquez ce mot de passe au client pour qu'il puisse se connecter avec son email.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1.5px solid #E4EAF6', paddingTop: 20 }}>
            <button type="button" onClick={() => navigate('/clients/gestion')}
              style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #E4EAF6', background: '#fff', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit"
              style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
              Enregistrer le partenaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
