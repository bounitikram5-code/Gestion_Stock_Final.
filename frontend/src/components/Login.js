import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate              = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', form);

      const user  = res.data.user;
      const token = res.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user',  JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (user.role === 'client') {
  navigate('/accueil-client');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      background: '#F0F4FF',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(160deg, #1a3a6e 0%, #0f1f42 60%, #0a1628 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left-panel">

        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>ISAG STOCK</span>
        </div>

       
        <div>
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, background: 'rgba(59,127,255,0.25)', border: '1px solid rgba(59,127,255,0.4)', color: '#93BBFF', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 20 }}>
            Gestion de Stock Pro v1.0
          </div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, lineHeight: 1.25, margin: '0 0 16px', letterSpacing: -0.5 }}>
            Gérez votre inventaire<br />avec précision
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Plateforme centralisée pour le suivi<br />des stocks, clients et mouvements.
          </p>
        </div>

      
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { val: '100%', label: 'Sécurisé' },
            { val: 'B2B',  label: 'Partenaires' },
            { val: 'Pro',  label: 'Interface' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#F0F4FF' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 6px', letterSpacing: -0.5 }}>Connexion</h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Accédez à votre espace de gestion</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 11, padding: '11px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 7 }}>Adresse email</label>
              <input type="email" required placeholder="vous@isagstock.ma"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 11, border: '1.5px solid #E4EAF6', background: '#fff', color: '#0F172A', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E4EAF6'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 7 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: '100%', padding: '11px 44px 11px 14px', borderRadius: 11, border: '1.5px solid #E4EAF6', background: '#fff', color: '#0F172A', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E4EAF6'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPwd
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', marginTop: 6, borderRadius: 11, border: 'none', background: loading ? '#94A3B8' : 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.35)', transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".7s" repeatCount="indefinite"/>
                    </path>
                  </svg>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 28 }}>
            ISAG STOCK — Accès réservé aux utilisateurs autorisés
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
