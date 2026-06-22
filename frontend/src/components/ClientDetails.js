import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
);

const C = {
  bg:         '#F8FAFC',
  surface:    '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border:     '#E2E8F0',
  blue:       '#0066FF',
  blueSoft:   '#E6F0FF',
  blueText:   '#0052CC',
  green:      '#10B981',
  greenSoft:  '#D1FAE5',
  greenText:  '#065F46',
  red:        '#EF4444',
  redSoft:    '#FEE2E2',
  text:       '#1E293B',
  textSub:    '#64748B',
  textHint:   '#94A3B8',
  shadow:     '0 4px 20px rgba(15, 23, 42, 0.04)',
};

const Skeleton = ({ w = '100%', h = 16, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: C.border, marginBottom: 8 }} />
);

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [clientArticles, setClientArticles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    axios.get(`http://127.0.0.1:8000/api/clients/${id}`)
      .then(res => {
        setClient(res.data);
        
        
        const dataArticles = res.data.articles || res.data.produits || [];
        
        if (dataArticles.length > 0) {
          setClientArticles(dataArticles);
          setLoading(false);
        } else {
          
          axios.get('http://127.0.0.1:8000/api/articles')
            .then(articlesRes => {
              
              const filtered = articlesRes.data.filter(art => 
                String(art.client_id) === String(id) || 
                (art.pivot && String(art.pivot.client_id) === String(id))
              );
              setClientArticles(filtered);
            })
            .catch(() => console.log("Pas pu filtrer les articles via l'API globale"))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      });
  }, [id]);

  const pageStyle = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: C.bg,
    minHeight: '100vh',
    padding: '32px',
    color: C.text,
  };

  if (!loading && error) return (
    <div style={pageStyle}>
      <FontLink />
      <div style={{ background: C.redSoft, borderRadius: 16, padding: '32px', textAlign: 'center', border: `1px solid ${C.red}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.red }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <FontLink />

     
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: C.text }}>Account</h2>
          <div style={{ fontSize: 12, color: C.textHint, marginTop: 4 }}>
            E-Commerce &gt; <span style={{ color: C.textSub }}>Account</span>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`,
            background: C.surface, color: C.textSub, cursor: 'pointer', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 6, boxShadow: C.shadow
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Retour
        </button>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, alignItems: 'start', marginBottom: 24 }}>
        
        {/* COL 1: Profil */}
        <div style={{ background: C.surface, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: C.shadow, textAlign: 'center' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton w="120px" h="120px" r="24px" />
              <Skeleton w="60%" h="20px" />
            </div>
          ) : (
            <>
              <div style={{ width: 140, height: 140, borderRadius: 24, overflow: 'hidden', margin: '0 auto 16px auto', border: `1px solid ${C.border}`, background: C.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={client?.logo ? `http://127.0.0.1:8000/storage/${client.logo}` : 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px 0', color: C.text }}>{client?.nom}</h3>
              
              <div style={{ display: 'inline-block', background: C.blueSoft, color: C.blue, padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 13, marginBottom: 24 }}>
                ID: #{client?.id}
              </div>

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14, borderTop: `1px solid ${C.border}`, paddingTop: 16, fontSize: 13, color: C.textSub }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {client?.ville || 'Non renseignée'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {client?.email || 'Non renseigné'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 .7A2 2 0 0 1 22 16.92z"></path></svg>
                  {client?.telephone || 'Non renseigné'}
                </div>
              </div>
            </>
          )}
        </div>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Account Details */}
          <div style={{ background: C.surface, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Account Details 
              <span style={{ cursor: 'pointer', color: C.textHint }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </span>
            </h4>
            {loading ? <><Skeleton /><Skeleton /></> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Nom Complet</span><strong>{client?.nom}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>I.C.E</span><strong>{client?.ice || '—'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Identifiant Fiscal</span><strong>{client?.identifiant_fiscal || '—'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Registre Commercial</span><strong>{client?.rc || '—'}</strong></div>
              </div>
            )}
          </div>

          <div style={{ background: C.surface, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Shipping Address 
              <span style={{ cursor: 'pointer', color: C.textHint }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </span>
            </h4>
            {loading ? <><Skeleton /><Skeleton /></> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Adresse</span><strong>{client?.adresse || '—'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Ville</span><strong>{client?.ville || '—'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.textHint }}>Patente</span><strong>{client?.patente || '—'}</strong></div>
              </div>
            )}
          </div>
        </div>

      </div>

    
      <div style={{ background: C.surface, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Wish List (Articles associés)</h3>
          <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>Total: {clientArticles.length}</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <Skeleton h={140} /><Skeleton h={140} /><Skeleton h={140} />
          </div>
        ) : clientArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.textHint }}>
             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div style={{ fontSize: 14, color: C.textSub }}>Aucun article associé à ce client spécifique.</div>
          </div>
        ) : (
        
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {clientArticles.map((art, idx) => {
              const currentQty = art.pivot?.quantite ?? art.quantite ?? 0;
              return (
                <div 
                  key={art.id + '-' + idx} 
                  style={{
                    display: 'flex', gap: 16, padding: 16, borderRadius: 12,
                    border: `1px solid ${C.border}`, background: C.surface,
                    alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}
                >
                  
                  <div style={{ width: 80, height: 80, background: C.surfaceAlt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {art.image ? (
                      <img src={`http://127.0.0.1:8000/storage/${art.image}`} alt={art.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    )}
                  </div>
                  
                 
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: C.text }}>
                      {art.nom || art.designation || 'Article sans nom'}
                    </h4>
                    <div style={{ fontSize: 12, color: C.textHint, marginBottom: 2 }}>Product ID: {art.id}</div>
                    <div style={{ fontSize: 12, color: C.textSub, marginBottom: 8 }}>Catégorie: <span style={{ color: C.text }}>{art.categorie || art.famille || 'Général'}</span></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                        {art.prix ? `${parseFloat(art.prix).toFixed(2)} DH` : '0.00 DH'}
                      </span>
                      
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 4,
                        background: currentQty > 0 ? C.blue : C.red, 
                        color: '#FFFFFF'
                      }}>
                        {currentQty > 0 ? `En Stock (${currentQty})` : 'Épuisé'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientDetails;