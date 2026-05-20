import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

/* ── Google Font ── */
const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
);

/* ── PALETTE (same as Clients.jsx) ── */
const C = {
  bg:         '#F0F4FF',
  surface:    '#FFFFFF',
  surfaceAlt: '#F7F9FF',
  border:     '#E4EAF6',
  borderHov:  '#C5D0F0',
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
  shadowHov:  '0 8px 32px rgba(37,99,235,0.15)',
};

const avatarPalette = [
  { bg: '#EEF3FF', text: '#1D4ED8' },
  { bg: '#ECFDF5', text: '#065F46' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FDF2F8', text: '#9D174D' },
  { bg: '#F0FDF4', text: '#166534' },
  { bg: '#EFF6FF', text: '#1E40AF' },
  { bg: '#FFF7ED', text: '#9A3412' },
];

/* ── helpers ── */
const InfoRow = ({ icon, label, value, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '13px 16px',
    borderRadius: 12,
    background: value ? C.surfaceAlt : C.bg,
    border: `1px solid ${C.border}`,
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      background: accent?.bg || C.blueSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16,
    }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.6px', color: C.textHint, marginBottom: 2 }}>{label}</div>
      <div style={{
        fontSize: 13.5, fontWeight: 500,
        color: value ? C.text : C.textHint,
        wordBreak: 'break-all',
      }}>{value || 'Non renseigné'}</div>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, bg, color }) => (
  <div style={{
    flex: '1 1 120px', minWidth: 110,
    background: C.surface, border: `1.5px solid ${C.border}`,
    borderRadius: 16, padding: '16px 14px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    boxShadow: C.shadow,
  }}>
    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: -0.5 }}>{value}</div>
    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.4px', color: C.textSub, textAlign: 'center' }}>{label}</div>
  </div>
);

/* ══════════════════════════════════════
   SKELETON
══════════════════════════════════════ */
const Skeleton = ({ w = '100%', h = 16, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: C.border, marginBottom: 6 }} />
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(() => setError('Partenaire introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  const av = avatarPalette[parseInt(id || 0) % avatarPalette.length];
  const articles = client?.articles || [];
  const totalQte = articles.reduce((s, a) => s + (a.pivot?.quantite ?? a.quantite ?? 0), 0);

  /* ── Page wrapper ── */
  const page = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: C.bg,
    minHeight: '100vh',
    padding: '28px 28px',
    color: C.text,
  };

  /* ── Error ── */
  if (!loading && error) return (
    <div style={page}>
      <FontLink />
      <button onClick={() => navigate(-1)} style={{ padding: '9px 18px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 13, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Retour
      </button>
      <div style={{ background: C.redSoft, border: `1.5px solid #FCA5A5`, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.red }}>{error}</div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>Vérifiez l'identifiant du partenaire</div>
      </div>
    </div>
  );

  return (
    <div style={page}>
      <FontLink />

      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '9px 18px', borderRadius: 10,
          border: `1.5px solid ${C.border}`,
          background: C.surface, color: C.textSub,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          marginBottom: 22,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          boxShadow: C.shadow,
          transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blueText; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Retour
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ══ LEFT COLUMN ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Profile card */}
          <div style={{
            background: C.surface, borderRadius: 20,
            border: `1.5px solid ${C.border}`,
            boxShadow: C.shadow, overflow: 'hidden',
          }}>
            {/* Top band */}
            <div style={{ height: 72, background: `linear-gradient(135deg, ${av.text}18, ${av.text}35)`, position: 'relative' }}>
              <div style={{
                position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)',
                width: 76, height: 76, borderRadius: '50%',
                background: loading ? C.border : (client?.logo ? 'transparent' : av.bg),
                border: `3px solid ${C.surface}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: C.shadow, flexShrink: 0,
              }}>
                {loading
                  ? null
                  : client?.logo
                    ? <img src={`http://127.0.0.1:8000/storage/${client.logo}`} alt={client.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 26, fontWeight: 700, color: av.text }}>
                        {(client?.nom || '?').slice(0, 2).toUpperCase()}
                      </span>
                }
              </div>
            </div>

            <div style={{ paddingTop: 48, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
              {loading
                ? <><Skeleton w="60%" h={20} /><Skeleton w="40%" h={13} /></>
                : <>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, marginBottom: 4 }}>{client.nom}</div>
                    <div style={{ fontSize: 13, color: C.textSub, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {client.ville || 'Ville non renseignée'}
                    </div>
                    <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: C.blueSoft, fontSize: 12, fontWeight: 600, color: C.blueText }}>
                      Partenaire B2B
                    </div>
                  </>
              }
            </div>
          </div>

          {/* Info fields */}
          <div style={{ background: C.surface, borderRadius: 20, border: `1.5px solid ${C.border}`, boxShadow: C.shadow, padding: 20 }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.6px', color: C.textHint, marginBottom: 14, fontWeight: 600 }}>Informations du partenaire</div>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={52} r={12} />)
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <InfoRow icon="✉️" label="Email" value={client.email} />
                  <InfoRow icon="📱" label="Téléphone" value={client.telephone} />
                  <InfoRow icon="📍" label="Adresse" value={client.adresse} />
                  <InfoRow icon="🏢" label="I.C.E" value={client.ice} accent={{ bg: C.amberSoft }} />
                  <InfoRow icon="📋" label="Identifiant fiscal" value={client.identifiant_fiscal} accent={{ bg: C.greenSoft }} />
                  <InfoRow icon="🗂️" label="Registre commercial" value={client.rc} />
                  <InfoRow icon="🏷️" label="Patente" value={client.patente} />
                </div>
            }
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ flex: '1 1 120px', height: 110, borderRadius: 16, background: C.border }} />)
              : <>
                  <StatCard icon="📦" label="Articles associés" value={articles.length} bg={C.blueSoft} color={C.blue} />
                  <StatCard icon="🔢" label="Quantité totale" value={totalQte} bg={C.greenSoft} color={C.green} />
                  <StatCard icon={articles.length > 0 ? '✅' : '⚠️'} label="Statut stock" value={articles.length > 0 ? 'Actif' : 'Vide'} bg={articles.length > 0 ? C.greenSoft : C.amberSoft} color={articles.length > 0 ? C.green : C.amber} />
                </>
            }
          </div>

          {/* Articles table */}
          <div style={{
            background: C.surface, borderRadius: 20,
            border: `1.5px solid ${C.border}`,
            boxShadow: C.shadow, overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📦</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Articles associés</div>
                  <div style={{ fontSize: 12, color: C.textSub }}>Stock par article de ce partenaire</div>
                </div>
              </div>
              {!loading && (
                <span style={{ padding: '4px 12px', borderRadius: 20, background: C.blueSoft, fontSize: 12, fontWeight: 600, color: C.blueText }}>
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: 20 }}>
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={44} r={8} />)}
              </div>
            ) : articles.length === 0 ? (
              <div style={{ padding: '52px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>Aucun article associé</div>
                <div style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>
                  Les articles apparaîtront ici après un mouvement de stock
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.surfaceAlt }}>
                      {['#', 'Désignation', 'Catégorie', 'Prix unit.', 'Quantité', 'Statut'].map(h => (
                        <th key={h} style={{
                          padding: '11px 16px', textAlign: h === '#' ? 'center' : 'left',
                          fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px',
                          color: C.textHint, fontWeight: 600, borderBottom: `1px solid ${C.border}`,
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((art, i) => {
                      const qty = art.pivot?.quantite ?? art.quantite ?? 0;
                      const isLow = qty > 0 && qty < 5;
                      const isEmpty = qty === 0;
                      return (
                        <tr key={art.id}
                          style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '13px 16px', textAlign: 'center', color: C.textHint, fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ fontWeight: 600, color: C.text }}>{art.nom || art.designation || '—'}</div>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            {art.categorie
                              ? <span style={{ padding: '3px 10px', borderRadius: 20, background: C.blueSoft, color: C.blueText, fontSize: 11, fontWeight: 600 }}>{art.categorie}</span>
                              : <span style={{ color: C.textHint }}>—</span>
                            }
                          </td>
                          <td style={{ padding: '13px 16px', fontWeight: 500, color: C.green }}>
                            {art.prix ? `${parseFloat(art.prix).toFixed(2)} DH` : '—'}
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{
                              display: 'inline-block',
                              minWidth: 36, textAlign: 'center',
                              padding: '4px 12px', borderRadius: 20, fontWeight: 700,
                              fontSize: 13,
                              background: isEmpty ? C.redSoft : isLow ? C.amberSoft : C.greenSoft,
                              color: isEmpty ? C.red : isLow ? C.amber : C.green,
                            }}>
                              {qty}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                              background: isEmpty ? C.redSoft : isLow ? C.amberSoft : C.greenSoft,
                              color: isEmpty ? C.redText : isLow ? C.amberText : C.greenText,
                            }}>
                              {isEmpty ? '⚠️ Épuisé' : isLow ? '⚡ Stock bas' : '✅ Disponible'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Table footer */}
                <div style={{
                  padding: '13px 20px',
                  background: C.surfaceAlt,
                  borderTop: `1px solid ${C.border}`,
                  display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 13, color: C.textSub }}>Quantité totale :</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>{totalQte} Pcs</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
