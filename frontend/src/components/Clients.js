import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ── Google Font ── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

/* ── PALETTE ── */
const C = {
  bg:         '#F1F5F9',
  surface:    '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  border:     '#E2E8F0',
  borderHov:  '#CBD5E1',
  blue:       '#2563EB',
  blueSoft:   '#EFF6FF',
  blueText:   '#1D4ED8',
  green:      '#059669',
  greenSoft:  '#ECFDF5',
  red:        '#DC2626',
  redSoft:    '#FEF2F2',
  amber:      '#D97706',
  amberSoft:  '#FFFBEB',
  text:       '#0F172A',
  textSub:    '#64748B',
  textHint:   '#94A3B8',
  shadow:     '0 1px 8px rgba(15,23,42,0.07)',
  shadowHov:  '0 8px 28px rgba(15,23,42,0.13)',
};

const avatarPalette = [
  { bg: '#EFF6FF', text: '#1D4ED8' },
  { bg: '#ECFDF5', text: '#065F46' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FDF2F8', text: '#9D174D' },
  { bg: '#F0FDF4', text: '#166534' },
  { bg: '#EFF6FF', text: '#1E40AF' },
  { bg: '#FFF7ED', text: '#9A3412' },
];

/* ── SVG Icons ── */
const IconUsers = ({ size = 20, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconMail = ({ size = 16, color = C.textHint }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconBuilding = ({ size = 16, color = C.textHint }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>
);

const IconAlert = ({ size = 16, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconPin = ({ size = 13, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconSearch = ({ size = 16, color = C.textHint }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const IconArrow = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconCheck = ({ size = 13, color = C.blueText }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconChevronDown = ({ size = 14, color = C.blueText }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconChevronUp = ({ size = 14, color = C.blueText }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

/* ── ClientCard ── */
const ClientCard = ({ client, index, onNavigate }) => {
  const [hov, setHov] = useState(false);
  const av = avatarPalette[index % avatarPalette.length];
  const initials = (client.nom || '?').slice(0, 2).toUpperCase();
  const hasLogo = !!client.logo;

  const badges = [
    { label: 'Email', ok: !!client.email },
    { label: 'ICE',   ok: !!client.ice   },
    { label: 'Tél',   ok: !!client.telephone },
  ];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        border: `1.5px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 18,
        padding: '28px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: hov ? C.shadowHov : C.shadow,
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'all .2s cubic-bezier(.4,0,.2,1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${av.text}50, ${av.text}cc)`,
        borderRadius: '18px 18px 0 0',
      }} />

      {/* Avatar */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: hasLogo ? 'transparent' : av.bg,
        border: `2px solid ${av.text}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 14,
        boxShadow: `0 0 0 5px ${av.bg}`,
        flexShrink: 0,
      }}>
        {hasLogo
          ? <img
              src={`http://127.0.0.1:8000/storage/${client.logo}`}
              alt={client.nom}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          : <span style={{ fontSize: 24, fontWeight: 700, color: av.text, letterSpacing: -1 }}>
              {initials}
            </span>
        }
      </div>

      {/* Name */}
      <div style={{
        fontSize: 15.5, fontWeight: 700, color: C.text,
        textAlign: 'center', marginBottom: 6, letterSpacing: -0.3,
      }}>
        {client.nom}
      </div>

      {/* City */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12.5, color: C.textSub, marginBottom: 18,
      }}>
        <IconPin />
        {client.ville || 'Ville non renseignée'}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 18, width: '100%' }}>
        {badges.map(({ label, ok }) => (
          <div key={label} style={{
            flex: 1, textAlign: 'center', padding: '7px 4px',
            borderRadius: 9,
            background: ok ? C.blueSoft : C.surfaceAlt,
            border: `1px solid ${ok ? C.borderHov : C.border}`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 16, marginBottom: 2,
            }}>
              {ok
                ? <IconCheck size={13} color={C.blueText} />
                : <span style={{ width: 13, height: 2, background: C.textHint, display: 'block', borderRadius: 2 }} />
              }
            </div>
            <div style={{
              fontSize: 10, color: ok ? C.blueText : C.textHint,
              textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate(client.id)}
        style={{
          width: '100%',
          padding: '11px 0',
          borderRadius: 11,
          border: 'none',
          background: hov ? `linear-gradient(135deg, ${C.blue}, #1D4ED8)` : C.blueSoft,
          color: hov ? '#fff' : C.blueText,
          fontSize: 13, fontWeight: 600,
          cursor: 'pointer',
          transition: 'all .2s',
          letterSpacing: 0.1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: 'inherit',
        }}
      >
        Voir le profil
        <IconArrow size={13} />
      </button>
    </div>
  );
};

/* ── EmptyState ── */
const EmptyState = ({ term }) => (
  <div style={{
    gridColumn: '1 / -1',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '72px 20px',
    background: C.surface, borderRadius: 18,
    border: `1.5px solid ${C.border}`,
    boxShadow: C.shadow,
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      background: C.blueSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 18,
    }}>
      <IconUsers size={28} color={C.blue} />
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>
      {term ? `Aucun résultat pour "${term}"` : 'Aucun partenaire enregistré'}
    </div>
    <div style={{ fontSize: 13, color: C.textSub }}>
      {term
        ? 'Essayez un autre nom ou ville'
        : 'Ajoutez votre premier partenaire commercial pour commencer'}
    </div>
  </div>
);

/* ── SkeletonCard ── */
const SkeletonCard = () => (
  <div style={{
    background: C.surface, borderRadius: 18, padding: '28px 20px 20px',
    border: `1.5px solid ${C.border}`, boxShadow: C.shadow,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.bg }} />
      <div style={{ width: '60%', height: 15, borderRadius: 8, background: C.bg }} />
      <div style={{ width: '40%', height: 12, borderRadius: 8, background: C.bg }} />
      <div style={{ display: 'flex', gap: 7, width: '100%' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 42, borderRadius: 9, background: C.bg }} />
        ))}
      </div>
      <div style={{ width: '100%', height: 40, borderRadius: 11, background: C.bg }} />
    </div>
  </div>
);

/* ── Stat Card ── */
const StatCard = ({ label, value, color, bg, icon }) => (
  <div style={{
    background: C.surface,
    border: `1.5px solid ${C.border}`,
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex', alignItems: 'center', gap: 14,
    flex: '1 1 155px', minWidth: 148,
    boxShadow: C.shadow,
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 11,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, letterSpacing: -0.5 }}>
        {value}
      </div>
      <div style={{
        fontSize: 11, color: C.textSub, marginTop: 3,
        textTransform: 'uppercase', letterSpacing: '.45px', fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  </div>
);

/* ── Main Component ── */
const Clients = () => {
  const [clients, setClients]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    (c.nom   || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.ville || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PAGE      = 9;
  const displayed = showAll ? filtered : filtered.slice(0, PAGE);
  const withEmail = clients.filter(c => c.email).length;
  const withIce   = clients.filter(c => c.ice).length;

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: C.bg,
      minHeight: '100vh',
      padding: '32px 28px',
      color: C.text,
    }}>
      <FontLink />

      {/* ── Header ── */}
      <div style={{
        background: C.surface,
        borderRadius: 18,
        border: `1.5px solid ${C.border}`,
        boxShadow: C.shadow,
        padding: '20px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: C.blueSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconUsers size={19} color={C.blue} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.4 }}>
              Répertoire des partenaires
            </h1>
            <p style={{ margin: 0, fontSize: 12.5, color: C.textSub, marginTop: 1 }}>
              {loading
                ? 'Chargement en cours…'
                : `${clients.length} partenaire${clients.length !== 1 ? 's' : ''} enregistré${clients.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }}>
            <IconSearch size={15} />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom ou ville…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowAll(false); }}
            style={{
              padding: '9px 14px 9px 36px',
              borderRadius: 10,
              border: `1.5px solid ${C.border}`,
              background: C.surfaceAlt,
              color: C.text,
              fontSize: 13,
              width: 300,
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color .15s',
            }}
            onFocus={e  => (e.target.style.borderColor = C.blue)}
            onBlur={e   => (e.target.style.borderColor = C.border)}
          />
        </div>
      </div>

      {/* ── Stats ── */}
      {!loading && clients.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatCard
            label="Total partenaires"
            value={clients.length}
            color={C.blue}
            bg={C.blueSoft}
            icon={<IconUsers size={19} color={C.blue} />}
          />
          <StatCard
            label="Avec email"
            value={withEmail}
            color={C.green}
            bg={C.greenSoft}
            icon={<IconMail size={18} color={C.green} />}
          />
          <StatCard
            label="Avec ICE"
            value={withIce}
            color={C.amber}
            bg={C.amberSoft}
            icon={<IconBuilding size={18} color={C.amber} />}
          />
          <StatCard
            label="Données incomplètes"
            value={clients.length - withIce}
            color={C.red}
            bg={C.redSoft}
            icon={<IconAlert size={18} color={C.red} />}
          />
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

      {/* ── Show more / less ── */}
      {!loading && filtered.length > PAGE && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '10px 26px',
              borderRadius: 22,
              border: `1.5px solid ${C.borderHov}`,
              background: C.surface,
              color: C.blueText,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: C.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 7,
              transition: 'all .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background    = C.blueSoft;
              e.currentTarget.style.borderColor   = C.blue;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background    = C.surface;
              e.currentTarget.style.borderColor   = C.borderHov;
            }}
          >
            {showAll
              ? <><IconChevronUp size={14} /> Réduire la liste</>
              : <><IconChevronDown size={14} /> Afficher tous les partenaires ({filtered.length})</>
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;