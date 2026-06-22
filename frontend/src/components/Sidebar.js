import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* ─── PALETTE ─── */
const C = {
  bg:        '#FFFFFF',
  bgHov:     '#F8FAFC',
  activeBg:  '#F3EFFF',
  activeTxt: '#7C3AED',
  border:    '#E2E8F0',
  text:      '#1E293B',
  textSub:   '#64748B',
  shadow:    '0 4px 24px rgba(148,163,184,0.10)',
};

/* ─── SVG ICONS ─── */
const Icons = {
  dashboard:    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  articles:     'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z',
  clients:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  gestion:      'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  fournisseurs: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3 M9 17H5 M14 17h2a2 2 0 002-2v-1 M16 11h6l-3-5-3 5z M18 17v4 M16 21h4',
  mouvements:   'M16 3h5v5 M4 20L21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
  stock:        'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  historique:   'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  admins:       'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  logout:       'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  menu:         'M3 12h18 M3 6h18 M3 18h18',
  close:        'M18 6L6 18 M6 6l12 12',
};

/* ─── ICON COMPONENT ─── */
const NavIcon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, transition: 'stroke 0.15s' }}
  >
    {d.split(' M').map((part, i) => (
      <path key={i} d={i === 0 ? part : 'M' + part} />
    ))}
  </svg>
);

/* ══════════════════════════════════════
   SIDEBAR COMPONENT
   ══════════════════════════════════════ */
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open,        setOpen]        = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin  = user.role === 'admin';
  const initials = (user.name || '??').slice(0, 2).toUpperCase();

  const menuItems = [
    { name: 'Dashboard',      path: '/dashboard',       icon: Icons.dashboard },
    { name: 'Articles',       path: '/articles',        icon: Icons.articles },
    { name: 'Clients',        path: '/clients',         icon: Icons.clients },
    { name: 'Gestion Clients',path: '/clients/gestion', icon: Icons.gestion },
    { name: 'Fournisseurs',   path: '/fournisseurs',    icon: Icons.fournisseurs },
    { name: 'Mouvements',     path: '/mouvements',      icon: Icons.mouvements },
    { name: 'Stock',          path: '/stock',           icon: Icons.stock },
    { name: 'Historique',     path: '/historique',      icon: Icons.historique },
    ...(isAdmin ? [{
      name: 'Gestion Admins', path: '/gestion-admins',  icon: Icons.admins, adminOnly: true
    }] : []),
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  /* ── Contenu sidebar (réutilisé desktop + mobile) ── */
  const SidebarContent = ({ isMobile = false }) => (
    <div style={{
      width: 250,
      height: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${C.border}`,
      boxShadow: C.shadow,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>

      {/* ── Logo + Titre ── */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.activeTxt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              flexShrink: 0,
            }}>
              <NavIcon d={Icons.stock} size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: -0.3 }}>
                ISAG STOCK
              </div>
              <div style={{
                fontSize: 10, color: C.textSub,
                textTransform: 'uppercase', fontWeight: 600,
                letterSpacing: '.5px', marginTop: 1,
              }}>
                {isAdmin ? 'Administrateur' : 'Manager'}
              </div>
            </div>
          </div>

          {/* ── Bouton fermer (mobile uniquement) ── */}
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              style={{
                background: '#F1F5F9', border: 'none', cursor: 'pointer',
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <NavIcon d={Icons.close} size={18} color={C.textSub} />
            </button>
          )}
        </div>
      </div>

      {/* ── Menu items ── */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{
          fontSize: 10, textTransform: 'uppercase', letterSpacing: '.8px',
          color: C.textSub, padding: '0 12px', marginBottom: 10, fontWeight: 700,
        }}>
          Navigation
        </div>

        {menuItems.map(item => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', display: 'block', marginBottom: 3 }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 10,
                  background: isActive ? C.activeBg : 'transparent',
                  color: isActive ? C.activeTxt : C.textSub,
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = C.bgHov;
                    e.currentTarget.style.color = C.text;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = C.textSub;
                  }
                }}
              >
                <NavIcon
                  d={item.icon}
                  size={18}
                  color={isActive ? C.activeTxt : C.textSub}
                />
                <span style={{ fontSize: 14, flex: 1 }}>{item.name}</span>
                {item.adminOnly && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 6,
                    background: '#F3EFFF', color: C.activeTxt,
                    fontSize: 9, fontWeight: 700, letterSpacing: '.3px',
                  }}>ADMIN</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Profil / Logout ── */}
      <div style={{
        padding: '12px 12px 16px',
        borderTop: `1px solid ${C.border}`,
        position: 'relative',
        flexShrink: 0,
        background: C.bg,
      }}>
        {/* Popup logout */}
        {showProfile && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 12, right: 12,
            background: '#fff', borderRadius: 12,
            border: `1px solid ${C.border}`,
            boxShadow: '0 12px 32px rgba(31,41,55,0.12)',
            padding: 8, zIndex: 200, marginBottom: 8,
          }}>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none',
              background: '#FEE2E2', color: '#EF4444',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
            }}>
              <NavIcon d={Icons.logout} size={15} color="#EF4444" />
              Déconnecter
            </button>
            <button onClick={() => setShowProfile(false)} style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: `1px solid ${C.border}`, background: '#fff',
              color: C.textSub, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              Annuler
            </button>
          </div>
        )}

        {/* Bouton profil */}
        <button
          onClick={() => setShowProfile(!showProfile)}
          style={{
            width: '100%', background: C.bgHov,
            border: `1px solid ${C.border}`, borderRadius: 12,
            padding: '10px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
          onMouseLeave={e => e.currentTarget.style.background = C.bgHov}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: C.activeTxt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            {initials}
          </div>
          <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: C.text,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user.name || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: C.textSub }}>
              {isAdmin ? 'Administrateur' : 'Manager'}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={C.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ════ DESKTOP — sidebar fixe visible ════ */}
      <div className="sidebar-desktop" style={{ width: 250, height: '100vh', flexShrink: 0 }}>
        <SidebarContent isMobile={false} />
      </div>

      {/* ════ MOBILE — bouton hamburger ════ */}
      <button
        className="sidebar-hamburger"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 1100,
          width: 42, height: 42, borderRadius: 11,
          background: C.bg, border: `1px solid ${C.border}`,
          display: 'none',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        }}
      >
        <NavIcon d={Icons.menu} size={20} color={C.text} />
      </button>

      {/* ════ MOBILE — overlay sombre ════ */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.30)',
            zIndex: 1050,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ════ MOBILE — sidebar qui slide ════ */}
      <div
        className="sidebar-mobile"
        style={{
          position: 'fixed', top: 0, zIndex: 1100,
          height: '100vh',
          left: open ? 0 : -260,
          transition: 'left .25s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <SidebarContent isMobile={true} />
      </div>

      {/* ════ CSS RESPONSIVE ════ */}
      <style>{`
        /* Desktop : sidebar visible, hamburger caché */
        @media (min-width: 769px) {
          .sidebar-desktop  { display: block !important; }
          .sidebar-hamburger{ display: none  !important; }
          .sidebar-mobile   { display: none  !important; }
        }

        /* Mobile : sidebar cachée, hamburger visible */
        @media (max-width: 768px) {
          .sidebar-desktop  { display: none  !important; }
          .sidebar-hamburger{ display: flex  !important; }
          .sidebar-mobile   { display: block !important; }
        }

        /* Scrollbar sidebar */
        .sidebar-desktop ::-webkit-scrollbar,
        .sidebar-mobile  ::-webkit-scrollbar { width: 4px; }
        .sidebar-desktop ::-webkit-scrollbar-track,
        .sidebar-mobile  ::-webkit-scrollbar-track { background: transparent; }
        .sidebar-desktop ::-webkit-scrollbar-thumb,
        .sidebar-mobile  ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .sidebar-desktop ::-webkit-scrollbar-thumb:hover,
        .sidebar-mobile  ::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </>
  );
};

export default Sidebar;
