import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
);

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
};

const avatarColors = [
  { bg: '#EEF3FF', text: '#1D4ED8' },
  { bg: '#ECFDF5', text: '#065F46' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FDF2F8', text: '#9D174D' },
  { bg: '#FFF7ED', text: '#9A3412' },
];

const Pill = ({ children, bg, color }) => (
  <span style={{ padding: '3px 10px', borderRadius: 20, background: bg, color, fontSize: 11, fontWeight: 600, display: 'inline-block' }}>
    {children}
  </span>
);

const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 10,
  border: `1.5px solid ${C.border}`, background: C.surfaceAlt,
  color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

// Composant pour gérer le menu déroulant de chaque ligne de manière isolée
const ActionMenu = ({ user, isMe, onEdit, onToggle, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: `1.5px solid ${C.border}`,
          borderRadius: 8,
          width: 30,
          height: 30,
          cursor: 'pointer',
          color: C.textSub,
          fontSize: 16,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.1s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.blueSoft)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        ⋮
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '34px',
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: 10,
            minWidth: 160,
            padding: '6px 0',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => { setIsOpen(false); onEdit(); }}
            style={{
              width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
             Réinit. MDP
          </button>

          {!isMe && (
            <>
              <button
                onClick={() => { setIsOpen(false); onToggle(); }}
                style={{
                  width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 12, color: user.is_active ? C.amberText : C.greenText, fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = user.is_active ? C.amberSoft : C.greenSoft)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {user.is_active ? ' Désactiver' : '⚡ Activer'}
              </button>

              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />

              <button
                onClick={() => { setIsOpen(false); onDelete(); }}
                style={{
                  width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 12, color: C.red, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.redSoft)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const AdminModal = ({ onClose, onSuccess, editUser }) => {
  const [form, setForm]       = useState({
    name:     editUser?.name     || '',
    email:    editUser?.email    || '',
    password: '',
    role:     editUser?.role     || 'manager',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editUser) {
        await axios.patch(
          `http://127.0.0.1:8000/api/admins/${editUser.id}/password`,
          { password: form.password },
          { headers }
        );
      } else {
        await axios.post('http://127.0.0.1:8000/api/admins', form, { headers });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(' | ') : (err.response?.data?.error || 'Erreur'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: C.surface, borderRadius: 20, border: `1.5px solid ${C.border}`, width: '100%', maxWidth: 420, padding: 28, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
              {editUser ? 'Réinitialiser le mot de passe' : 'Ajouter un utilisateur'}
            </div>
            <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>
              {editUser ? `Compte : ${editUser.name}` : 'Créer un nouveau compte admin ou manager'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.textSub }}>×</button>
        </div>

        {error && (
          <div style={{ background: C.redSoft, border: `1px solid #FECACA`, borderRadius: 9, padding: '10px 13px', marginBottom: 16, fontSize: 12, color: C.red }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {!editUser && (
            <>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>Nom complet</label>
                <input type="text" required value={form.name} placeholder="Prénom Nom"
                  onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>Email</label>
                <input type="email" required value={form.email} placeholder="email@isagstock.ma"
                  onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>Rôle</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="admin">Administrateur — accès total</option>
                  <option value="manager">Manager — accès limité</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>
              {editUser ? 'Nouveau mot de passe' : 'Mot de passe'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                required minLength={8}
                placeholder="Min. 8 caractères"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textHint }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPwd
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: 11, borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.textSub, fontSize: 13, cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 2, padding: 11, borderRadius: 10, border: 'none', background: C.blue, color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
              {loading ? 'En cours...' : editUser ? 'Réinitialiser' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestionAdmins = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [search, setSearch]       = useState('');
  const [toast, setToast]         = useState('');

  const me = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggle = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/admins/${user.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Compte ${user.is_active ? 'désactivé' : 'activé'} avec succès`);
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.error || 'Erreur');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer le compte de ${user.name} ?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/admins/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Compte supprimé');
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.error || 'Erreur');
    }
  };

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins   = users.filter(u => u.role === 'admin').length;
  const totalManagers = users.filter(u => u.role === 'manager').length;
  const totalInactive = users.filter(u => !u.is_active).length;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, minHeight: '100vh', padding: 'clamp(16px,4vw,32px)', color: C.text }}>
      <FontLink />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: C.surface, border: `1.5px solid ${C.border}`,
          borderRadius: 12, padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          fontSize: 13, fontWeight: 500, color: C.text,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`, boxShadow: C.shadow, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Gestion des utilisateurs</div>
            <div style={{ fontSize: 12, color: C.textSub }}>Administrateurs et managers du système</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textHint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Rechercher..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: 220, paddingLeft: 34 }} />
          </div>

          <button onClick={() => { setEditUser(null); setShowModal(true); }}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: C.blue, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(37,99,235,0.3)', whiteSpace: 'nowrap' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Ajouter
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total utilisateurs', val: users.length, bg: C.blueSoft, color: C.blue },
          { label: 'Administrateurs',    val: totalAdmins,   bg: C.amberSoft, color: C.amber },
          { label: 'Managers',           val: totalManagers, bg: C.greenSoft, color: C.green },
          { label: 'Inactifs',           val: totalInactive, bg: C.redSoft,   color: C.red },
        ].map(({ label, val, bg, color }) => (
          <div key={label} style={{ flex: '1 1 130px', background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: C.shadow }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: -0.5 }}>{val}</div>
            <div style={{ fontSize: 11, color: C.textSub, textTransform: 'uppercase', letterSpacing: '.4px', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`, boxShadow: C.shadow, overflow: 'visible' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
            <thead>
              <tr style={{ background: C.surfaceAlt }}>
                {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Depuis', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', color: C.textHint, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} style={{ padding: '14px 16px' }}>
                      <div style={{ height: 20, borderRadius: 6, background: C.bg }} />
                    </td></tr>
                  ))
                : filtered.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: C.textSub }}>
                      Aucun utilisateur trouvé
                    </td></tr>
                  : filtered.map((user, i) => {
                      const av = avatarColors[i % avatarColors.length];
                      const isMe = user.id === me.id;
                      const date = new Date(user.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

                      return (
                        <tr key={user.id}
                          style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: av.text, flexShrink: 0 }}>
                                {(user.name || '?').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: C.text }}>
                                  {user.name}
                                  {isMe && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 10, background: C.blueSoft, color: C.blueText, fontSize: 10, fontWeight: 600 }}>Moi</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '13px 16px', color: C.textSub }}>{user.email}</td>

                          <td style={{ padding: '13px 16px' }}>
                            <Pill bg={user.role === 'admin' ? C.amberSoft : C.blueSoft} color={user.role === 'admin' ? C.amberText : C.blueText}>
                              {user.role === 'admin' ? 'Administrateur' : 'Manager'}
                            </Pill>
                          </td>

                          <td style={{ padding: '13px 16px' }}>
                            <Pill bg={user.is_active ? C.greenSoft : C.redSoft} color={user.is_active ? C.greenText : C.redText}>
                              {user.is_active ? 'Actif' : 'Inactif'}
                            </Pill>
                          </td>

                          <td style={{ padding: '13px 16px', color: C.textSub, whiteSpace: 'nowrap' }}>{date}</td>

                          
                          <td style={{ padding: '13px 16px' }}>
                            <ActionMenu
                              user={user}
                              isMe={isMe}
                              onEdit={() => { setEditUser(user); setShowModal(true); }}
                              onToggle={() => handleToggle(user)}
                              onDelete={() => handleDelete(user)}
                            />
                          </td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>
      </div>

     
      {showModal && (
        <AdminModal
          editUser={editUser}
          onClose={() => { setShowModal(false); setEditUser(null); }}
          onSuccess={() => { fetchUsers(); showToast('Opération réussie'); }}
        />
      )}
    </div>
  );
};

export default GestionAdmins;