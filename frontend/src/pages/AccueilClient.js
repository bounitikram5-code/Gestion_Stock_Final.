import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccueilClient = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/mon-stock', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setClient(res.data))
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const articles   = client?.articles || [];
  const totalQte   = articles.reduce((s, a) => s + (a.pivot?.quantite ?? a.quantite ?? 0), 0);
  const lowStock   = articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) < 5 && (a.pivot?.quantite ?? a.quantite ?? 0) > 0).length;
  const outOfStock = articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) === 0).length;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1f42 0%, #1a3a6e 50%, #1e4d8c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1f42 0%, #1a3a6e 50%, #1e4d8c 100%)',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />


      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

    
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(20px,5vw,48px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>GESTION DE STOCK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(37,99,235,0.5)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {(user.name || '?').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Client</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            padding: '7px 16px', borderRadius: 9,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Déconnecter
          </button>
        </div>
      </div>

    
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(48px,10vh,80px) clamp(20px,5vw,48px) clamp(32px,6vh,60px)',
      }}>

        
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 16px', borderRadius: 20, marginBottom: 28,
          background: 'rgba(37,99,235,0.25)',
          border: '1px solid rgba(59,127,255,0.4)',
          fontSize: 12, fontWeight: 600, color: '#93BBFF',
          letterSpacing: 0.3,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          Espace Client — Stock en temps réel
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 54px)',
          fontWeight: 800, letterSpacing: -1.5,
          margin: '0 0 16px',
          lineHeight: 1.1,
          maxWidth: 700,
        }}>
          {greeting},{' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {client?.nom || user.name}
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(255,255,255,0.6)', margin: '0 0 40px', maxWidth: 480, lineHeight: 1.7 }}>
          Consultez l'état de votre inventaire, suivez vos articles et gérez votre stock en toute simplicité.
        </p>

       
        <button onClick={() => navigate('/mon-stock')} style={{
          padding: 'clamp(12px,2vw,16px) clamp(28px,5vw,48px)',
          borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#fff', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700,
          cursor: 'pointer', letterSpacing: -0.3,
          boxShadow: '0 8px 32px rgba(37,99,235,0.5)',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.5)'; }}
        >
          Accéder à mon stock
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
        padding: '0 clamp(20px,5vw,48px) clamp(40px,8vh,80px)',
      }}>
        {[
          { label: 'Articles associés', value: articles.length, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
          { label: 'Quantité totale', value: `${totalQte} Pcs`, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
          { label: 'Stock bas', value: lowStock, color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
          { label: 'Articles épuisés', value: outOfStock, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            flex: '1 1 160px', minWidth: 140, maxWidth: 220,
            background: bg, border: `1px solid ${border}`,
            borderRadius: 16, padding: '20px 24px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            transition: 'transform .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

     
      {articles.length > 0 && (
        <div style={{
          position: 'relative', zIndex: 10,
          padding: '0 clamp(20px,5vw,48px) clamp(40px,8vh,80px)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.8px', color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 600 }}>Aperçu de vos articles</div>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {articles.slice(0, 3).map(art => {
              const qty = art.pivot?.quantite ?? art.quantite ?? 0;
              const isEmpty = qty === 0;
              const isLow   = qty > 0 && qty < 5;
              const qtyColor = isEmpty ? '#f87171' : isLow ? '#fb923c' : '#4ade80';
              return (
                <div key={art.id} style={{
                  flex: '1 1 180px', maxWidth: 240,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '20px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: '#fff' }}>{art.nom || art.designation}</div>
                  {art.categorie && (
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{art.categorie}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: qtyColor }}>{qty}</span>
                    <span style={{ fontSize: 11, color: qtyColor, fontWeight: 600, background: `${qtyColor}22`, padding: '3px 10px', borderRadius: 20 }}>
                      {isEmpty ? 'Épuisé' : isLow ? 'Stock bas' : 'Disponible'}
                    </span>
                  </div>
                </div>
              );
            })}
            {articles.length > 3 && (
              <div style={{
                flex: '1 1 180px', maxWidth: 240,
                background: 'rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.3)',
                borderRadius: 16, padding: '20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onClick={() => navigate('/mon-stock')}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa' }}>+{articles.length - 3}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>autres articles</div>
                <div style={{ marginTop: 12, fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>Voir tout →</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccueilClient;
