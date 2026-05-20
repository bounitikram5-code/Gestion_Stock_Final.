import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ── Google Font ── */
const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
);

/* ── PALETTE (alwan mftoha / light professional) ── */
const C = {
  bg:          '#F0F4FF',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F7F9FF',
  border:      '#E4EAF6',
  borderHov:   '#C5D0F0',
  blue:        '#2563EB',
  blueSoft:    '#EEF3FF',
  blueText:    '#1D4ED8',
  green:       '#059669',
  greenSoft:   '#ECFDF5',
  red:         '#DC2626',
  redSoft:     '#FEF2F2',
  amber:       '#D97706',
  amberSoft:   '#FFFBEB',
  text:        '#0F172A',
  textSub:     '#64748B',
  textHint:    '#94A3B8',
  shadow:      '0 2px 16px rgba(37,99,235,0.08)',
  shadowHov:   '0 8px 32px rgba(37,99,235,0.15)',
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

/* ══════════════════════════════════
   CLIENT CARD
══════════════════════════════════ */
const ClientCard = ({ client, index, onNavigate }) => {
  const [hov, setHov] = useState(false);
  const av = avatarPalette[index % avatarPalette.length];
  const initials = (client.nom || '?').slice(0, 2).toUpperCase();
  const hasLogo = !!client.logo;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        border: `1.5px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 20,
        padding: '28px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        boxShadow: hov ? C.shadowHov : C.shadow,
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all .22s cubic-bezier(.4,0,.2,1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${av.text}40, ${av.text}99)`,
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Avatar / Logo */}
      <div style={{
        width: 76, height: 76, borderRadius: '50%',
        background: hasLogo ? 'transparent' : av.bg,
        border: `2.5px solid ${av.text}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 14,
        boxShadow: `0 0 0 5px ${av.bg}`,
        flexShrink: 0,
      }}>
        {hasLogo
          ? <img src={`http://127.0.0.1:8000/storage/${client.logo}`} alt={client.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 26, fontWeight: 700, color: av.text, letterSpacing: -1 }}>{initials}</span>
        }
      </div>

      {/* Name */}
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 }}>
        {client.nom}
      </div>

      {/* Ville */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: C.textSub, marginBottom: 18 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {client.ville || 'Non renseigné'}
      </div>

      {/* Stats mini row */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 18, width: '100%',
      }}>
        {[
          { label: 'Email', val: client.email ? '✓' : '—', ok: !!client.email },
          { label: 'ICE', val: client.ice ? '✓' : '—', ok: !!client.ice },
          { label: 'Tél', val: client.telephone ? '✓' : '—', ok: !!client.telephone },
        ].map(({ label, val, ok }) => (
          <div key={label} style={{
            flex: 1, textAlign: 'center', padding: '7px 4px',
            borderRadius: 10,
            background: ok ? C.blueSoft : C.surfaceAlt,
            border: `1px solid ${ok ? C.borderHov : C.border}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ok ? C.blueText : C.textHint }}>{val}</div>
            <div style={{ fontSize: 10, color: C.textSub, marginTop: 1, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onNavigate(client.id)}
        style={{
          width: '100%',
          padding: '11px 0',
          borderRadius: 12,
          border: 'none',
          background: hov
            ? `linear-gradient(135deg, ${C.blue}, #1D4ED8)`
            : C.blueSoft,
          color: hov ? '#fff' : C.blueText,
          fontSize: 13.5,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all .22s',
          letterSpacing: 0.1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
      >
        Voir les détails
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
};

/* ══════════════════════════════════
   EMPTY STATE
══════════════════════════════════ */
const EmptyState = ({ term }) => (
  <div style={{
    gridColumn: '1 / -1',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '72px 20px',
    background: C.surface, borderRadius: 20,
    border: `1.5px solid ${C.border}`,
    boxShadow: C.shadow,
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: C.blueSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 20,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>
      {term ? `Aucun résultat pour "${term}"` : 'Aucun partenaire enregistré'}
    </div>
    <div style={{ fontSize: 13, color: C.textSub }}>
      {term ? 'Essayez un autre nom ou ville' : 'Ajoutez votre premier partenaire commercial'}
    </div>
  </div>
);

/* ══════════════════════════════════
   SKELETON LOADER
══════════════════════════════════ */
const SkeletonCard = () => (
  <div style={{
    background: C.surface, borderRadius: 20, padding: '28px 20px 20px',
    border: `1.5px solid ${C.border}`, boxShadow: C.shadow,
  }}>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 76, height: 76, borderRadius: '50%', background: C.bg }} />
      <div style={{ width: '60%', height: 16, borderRadius: 8, background: C.bg }} />
      <div style={{ width: '40%', height: 12, borderRadius: 8, background: C.bg }} />
      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
        {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 44, borderRadius: 10, background: C.bg }} />)}
      </div>
      <div style={{ width: '100%', height: 42, borderRadius: 12, background: C.bg }} />
    </div>
  </div>
);

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    (c.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.ville || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PAGE = 9;
  const displayed = showAll ? filtered : filtered.slice(0, PAGE);

  /* Stats */
  const withEmail = clients.filter(c => c.email).length;
  const withIce   = clients.filter(c => c.ice).length;

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: C.bg,
      minHeight: '100vh',
      padding: '32px 28px',
      color: C.text,
    }}>
      <FontLink />

      {/* ── Header ── */}
      <div style={{
        background: C.surface,
        borderRadius: 20,
        border: `1.5px solid ${C.border}`,
        boxShadow: C.shadow,
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: C.blueSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.4 }}>
              Répertoire Partenaires
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>
            {loading ? 'Chargement...' : `${clients.length} partenaire${clients.length !== 1 ? 's' : ''} enregistré${clients.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom ou ville..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowAll(false); }}
            style={{
              padding: '10px 16px 10px 40px',
              borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              background: C.surfaceAlt,
              color: C.text,
              fontSize: 13,
              width: 320,
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'border-color .15s',
            }}
            onFocus={e => e.target.style.borderColor = C.blue}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>
      </div>

      {/* ── Stats Bar ── */}
      {!loading && clients.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total partenaires', value: clients.length, color: C.blue, bg: C.blueSoft, icon: '👥' },
            { label: 'Avec email', value: withEmail, color: C.green, bg: C.greenSoft, icon: '✉️' },
            { label: 'Avec ICE', value: withIce, color: C.amber, bg: C.amberSoft, icon: '🏢' },
            { label: 'Sans données complètes', value: clients.length - withIce, color: C.red, bg: C.redSoft, icon: '⚠️' },
          ].map(({ label, value, color, bg, icon }) => (
            <div key={label} style={{
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 16,
              padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              flex: '1 1 160px', minWidth: 155,
              boxShadow: C.shadow,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: 16,
      }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : displayed.length === 0
            ? <EmptyState term={searchTerm} />
            : displayed.map((c, i) => (
                <ClientCard
                  key={c.id}
                  client={c}
                  index={i}
                  onNavigate={id => navigate(`/clients/${id}`)}
                />
              ))
        }
      </div>

      {/* ── Show More ── */}
      {!loading && filtered.length > PAGE && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '11px 28px',
              borderRadius: 24,
              border: `1.5px solid ${C.borderHov}`,
              background: C.surface,
              color: C.blueText,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: C.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.blueSoft; e.currentTarget.style.borderColor = C.blue; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.borderHov; }}
          >
            {showAll
              ? <>Réduire ↑</>
              : <>Voir tous les partenaires ({filtered.length}) ↓</>
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;
