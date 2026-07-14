import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const C = {
  bg:         '#F0F4FF',
  surface:    '#FFFFFF',
  surfaceAlt: '#F7F9FF',
  border:     '#E4EAF6',
  blue:       '#2563EB',
  blueSoft:   '#EEF3FF',
  blueText:   '#1D4ED8',
  green:      '#059669',
  greenSoft:  '#ECFDF5',
  greenText:  '#065F46',
  red:        '#DC2626',
  redSoft:    '#FEF2F2',
  redText:    '#991B1B',
  amber:      '#D97706',
  amberSoft:  '#FFFBEB',
  amberText:  '#92400E',
  text:       '#0F172A',
  textSub:    '#64748B',
  textHint:   '#94A3B8',
  shadow:     '0 2px 16px rgba(37,99,235,0.08)',
};

const MonStock = () => {
  const [client, setClient]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('articles');
  const navigate              = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/mon-stock', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setClient(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

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

  const articles   = client?.articles || [];
  const totalQte   = articles.reduce((s, a) => s + (a.pivot?.quantite ?? a.quantite ?? 0), 0);
  const lowStock   = articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) < 5 && (a.pivot?.quantite ?? a.quantite ?? 0) > 0).length;
  const outOfStock = articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) === 0).length;

  const card = (extra = {}) => ({
    background: C.surface,
    border: `1.5px solid ${C.border}`,
    borderRadius: 16,
    boxShadow: C.shadow,
    ...extra,
  });

  if (loading) return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: 'center', color: C.textSub }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.blue, margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Chargement...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, minHeight: '100vh', color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      
      <div style={{ background: C.surface, borderBottom: `1.5px solid ${C.border}`, padding: '0 clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100, boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>GESTION SE STOCK</div>
            <div style={{ fontSize: 10, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.5px' }}>Espace client</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: C.textSub }}>Client</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: C.blueText }}>
            {(user.name || 'C').slice(0, 2).toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{ padding: '7px 14px', borderRadius: 9, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.textSub, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Déconnecter
          </button>
        </div>
      </div>

      <div style={{ padding: 'clamp(16px,4vw,28px)' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 }}>
            Bonjour, {client?.nom || user.name} 👋
          </h1>
          <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>
            Voici l'état de votre stock en temps réel
          </p>
        </div>

       
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Articles',       value: articles.length, color: C.blue,  bg: C.blueSoft  },
            { label: 'Quantité totale',value: totalQte,        color: C.green, bg: C.greenSoft },
            { label: 'Stock bas',      value: lowStock,        color: C.amber, bg: C.amberSoft },
            { label: 'Épuisés',        value: outOfStock,      color: C.red,   bg: C.redSoft   },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ ...card({ padding: '14px 18px', flex: '1 1 130px', minWidth: 120, display: 'flex', alignItems: 'center', gap: 12 }) }}>
              <div style={{ width: 4, height: 36, borderRadius: 4, background: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        
        {client && (
          <div style={{ ...card({ padding: '16px 20px', marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 20 }) }}>
            {[
              { label: 'Ville',     value: client.ville },
              { label: 'Téléphone', value: client.telephone },
              { label: 'Email',     value: client.email },
              { label: 'I.C.E',     value: client.ice },
              { label: 'Adresse',   value: client.adresse },
            ].filter(i => i.value).map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: C.textHint, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 5, width: 'fit-content', boxShadow: C.shadow }}>
          {[
            { id: 'articles',   label: 'Mes articles' },
            { id: 'historique', label: 'Mon historique' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '8px 18px', borderRadius: 9, border: 'none',
              background: tab === id ? C.blue : 'transparent',
              color: tab === id ? '#fff' : C.textSub,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

      
        {tab === 'articles' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {articles.length === 0 ? (
              <div style={{ ...card({ padding: '48px 20px', textAlign: 'center', gridColumn: '1/-1' }) }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: .4 }}>📦</div>
                <div style={{ fontWeight: 600, color: C.text }}>Aucun article associé</div>
                <div style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>Vos articles apparaîtront ici</div>
              </div>
            ) : articles.map((art, i) => {
              const qty     = art.pivot?.quantite ?? art.quantite ?? 0;
              const isEmpty = qty === 0;
              const isLow   = qty > 0 && qty < 5;
              const statusBg    = isEmpty ? C.redSoft   : isLow ? C.amberSoft  : C.greenSoft;
              const statusColor = isEmpty ? C.red       : isLow ? C.amber      : C.green;
              const statusLabel = isEmpty ? 'Épuisé'   : isLow ? 'Stock bas'  : 'Disponible';

              return (
                <div key={art.id} style={{ ...card({ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }) }}>
                  {/* Image ila kayna */}
                  {art.image && Array.isArray(art.image) && art.image[0] ? (
                    <div style={{ width: '100%', height: 120, borderRadius: 10, overflow: 'hidden', background: C.surfaceAlt }}>
                      <img src={`http://127.0.0.1:8000/storage/${art.image[0]}`} alt={art.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: 90, borderRadius: 10, background: C.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      </svg>
                    </div>
                  )}

                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{art.nom || art.designation}</div>
                    {art.categorie && (
                      <span style={{ padding: '2px 8px', borderRadius: 20, background: C.blueSoft, color: C.blueText, fontSize: 11, fontWeight: 600 }}>{art.categorie}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, background: statusBg, color: statusColor, fontSize: 12, fontWeight: 700 }}>
                      {qty} Pcs
                    </span>
                    <span style={{ padding: '3px 9px', borderRadius: 20, background: statusBg, color: statusColor, fontSize: 11, fontWeight: 600 }}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'historique' && (
          <div style={{ ...card({ overflow: 'hidden' }) }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
                <thead>
                  <tr style={{ background: C.surfaceAlt }}>
                    {['Article', 'Type', 'Quantité', 'Date'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: C.textHint, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(client?.mouvements || []).length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: C.textSub }}>Aucun mouvement enregistré</td></tr>
                  ) : (client?.mouvements || []).map(mouv => {
                    const isEntree = mouv.type?.includes('Entrée');
                    return (
                      <tr key={mouv.id} style={{ borderBottom: `1px solid ${C.border}` }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{mouv.article?.nom || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: isEntree ? C.greenSoft : C.redSoft, color: isEntree ? C.greenText : C.redText }}>
                            {isEntree ? '↓ Entrée' : '↑ Sortie'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{mouv.quantite} Pcs</td>
                        <td style={{ padding: '12px 16px', color: C.textSub }}>{mouv.date || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonStock;
