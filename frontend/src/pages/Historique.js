import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
);

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

const avatarColors = [
  { bg: '#EEF3FF', text: '#1D4ED8' },
  { bg: '#ECFDF5', text: '#065F46' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FDF2F8', text: '#9D174D' },
  { bg: '#FFF7ED', text: '#9A3412' },
];

const ACTION_CONFIG = {
  'Ajout article':        { bg: C.greenSoft, color: C.green,   icon: '+' },
  'Modification article': { bg: C.blueSoft,  color: C.blue,    icon: '✎' },
  'Suppression article':  { bg: C.redSoft,   color: C.red,     icon: '×' },
  'Ajout client':         { bg: C.greenSoft, color: C.green,   icon: '+' },
  'Modification client':  { bg: C.blueSoft,  color: C.blue,    icon: '✎' },
  'Suppression client':   { bg: C.redSoft,   color: C.red,     icon: '×' },
  'Mouvement Entrée':     { bg: C.greenSoft, color: C.green,   icon: '↓' },
  'Mouvement Sortie':     { bg: C.redSoft,   color: C.red,     icon: '↑' },
  'default':              { bg: C.amberSoft, color: C.amber,   icon: '•' },
};

const getActionCfg = (action) => {
  for (const key of Object.keys(ACTION_CONFIG)) {
    if (action?.includes(key.split(' ')[0]) && action?.includes(key.split(' ')[1] || '')) {
      return ACTION_CONFIG[key];
    }
  }
  return ACTION_CONFIG['default'];
};

const Skeleton = () => (
  <tr>
    {[0,1,2,3,4,5].map(i => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <div style={{ height: 14, borderRadius: 6, background: C.border, width: i === 0 ? '80%' : i === 1 ? '60%' : '70%' }} />
      </td>
    ))}
  </tr>
);

const Historique = () => {
  const [mouvements, setMouvements] = useState([]);
  const [logs, setLogs]             = useState([]);
  const [activeTab, setActiveTab]   = useState('mouvements');
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    Promise.all([
      axios.get('http://127.0.0.1:8000/api/mouvements', { headers }),
      axios.get('http://127.0.0.1:8000/api/activity-logs', { headers }).catch(() => ({ data: [] })),
    ]).then(([resMouv, resLogs]) => {
      setMouvements(resMouv.data);
      setLogs(resLogs.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMouv = mouvements.filter(m =>
    (m.article?.nom || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.tiers || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.type || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredLogs = logs.filter(l =>
    (l.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const Tab = ({ id, label, count }) => (
    <button onClick={() => setActiveTab(id)} style={{
      padding: '8px 18px', borderRadius: 10, border: 'none',
      background: activeTab === id ? C.blue : 'transparent',
      color: activeTab === id ? '#fff' : C.textSub,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 7,
      transition: 'all .15s',
    }}>
      {label}
      <span style={{
        padding: '1px 8px', borderRadius: 20, fontSize: 11,
        background: activeTab === id ? 'rgba(255,255,255,0.25)' : C.border,
        color: activeTab === id ? '#fff' : C.textSub,
      }}>{count}</span>
    </button>
  );

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: C.bg, minHeight: '100vh',
      padding: 'clamp(16px,4vw,32px)', color: C.text,
    }}>
      <FontLink />

      
      <div style={{
        background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`,
        boxShadow: C.shadow, padding: '20px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Historique</div>
            <div style={{ fontSize: 12, color: C.textSub }}>Mouvements de stock et actions des utilisateurs</div>
          </div>
        </div>

      
        <div style={{ position: 'relative' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Rechercher..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '9px 14px 9px 34px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: C.surfaceAlt,
              color: C.text, fontSize: 13, outline: 'none', width: 220,
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = C.blue}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>
      </div>

      
      <div style={{
        background: C.surface, borderRadius: 14, border: `1.5px solid ${C.border}`,
        padding: '6px 8px', marginBottom: 16, display: 'inline-flex', gap: 4,
        boxShadow: C.shadow,
      }}>
        <Tab id="mouvements" label="Mouvements stock" count={mouvements.length} />
        <Tab id="logs"       label="Actions utilisateurs" count={logs.length} />
      </div>

    
      <div style={{ background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`, boxShadow: C.shadow, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>

          
          {activeTab === 'mouvements' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
              <thead>
                <tr style={{ background: C.surfaceAlt }}>
                  {['Article', 'Client', 'Type', 'Quantité', 'Tiers', 'Date'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: C.textHint, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
                  : filteredMouv.length === 0
                    ? <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: C.textSub }}>Aucun mouvement trouvé</td></tr>
                    : filteredMouv.map((mouv, i) => {
                        const isEntree = mouv.type?.includes('Entrée');
                        return (
                          <tr key={mouv.id}
                            style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .12s' }}
                            onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '13px 16px', fontWeight: 600 }}>{mouv.article?.nom || '—'}</td>
                            <td style={{ padding: '13px 16px', color: C.textSub }}>{mouv.client?.nom || '—'}</td>
                            <td style={{ padding: '13px 16px' }}>
                              <span style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: isEntree ? C.greenSoft : C.redSoft,
                                color: isEntree ? C.greenText : C.redText,
                              }}>
                                {isEntree ? '↓ Entrée' : '↑ Sortie'}
                              </span>
                            </td>
                            <td style={{ padding: '13px 16px', fontWeight: 600 }}>{mouv.quantite} Pcs</td>
                            <td style={{ padding: '13px 16px', color: C.textSub }}>{mouv.tiers || '—'}</td>
                            <td style={{ padding: '13px 16px', color: C.textSub, whiteSpace: 'nowrap' }}>{mouv.date || '—'}</td>
                          </tr>
                        );
                      })
                }
              </tbody>
            </table>
          )}

         
          {activeTab === 'logs' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
              <thead>
                <tr style={{ background: C.surfaceAlt }}>
                  {['Utilisateur', 'Action', 'Description', 'Date & Heure'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: C.textHint, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
                  : filteredLogs.length === 0
                    ? <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: C.textSub }}>Aucune action enregistrée</td></tr>
                    : filteredLogs.map((log, i) => {
                        const av = avatarColors[i % avatarColors.length];
                        const cfg = getActionCfg(log.action);
                        const date = new Date(log.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        return (
                          <tr key={log.id}
                            style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .12s' }}
                            onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 9, background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: av.text, flexShrink: 0 }}>
                                  {(log.user_name || '?').slice(0, 2).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600 }}>{log.user_name || '—'}</span>
                              </div>
                            </td>

                           
                            <td style={{ padding: '13px 16px' }}>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: cfg.bg, color: cfg.color,
                              }}>
                                <span style={{ fontSize: 13 }}>{cfg.icon}</span>
                                {log.action}
                              </span>
                            </td>

                          
                            <td style={{ padding: '13px 16px', color: C.textSub }}>{log.description || '—'}</td>

                            
                            <td style={{ padding: '13px 16px', color: C.textSub, whiteSpace: 'nowrap' }}>{date}</td>
                          </tr>
                        );
                      })
                }
              </tbody>
            </table>
          )}
        </div>

        
        {!loading && (
          <div style={{ padding: '11px 20px', background: C.surfaceAlt, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, color: C.textSub }}>
              {activeTab === 'mouvements'
                ? `${filteredMouv.length} mouvement${filteredMouv.length !== 1 ? 's' : ''}`
                : `${filteredLogs.length} action${filteredLogs.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;
