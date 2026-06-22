import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Font Link (Inter) ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

/* ─── Clean UI Colors ─── */
const C = {
  bg: '#F8FAFC',          
  surface: '#FFFFFF',     
  text: '#1E293B',        
  textMuted: '#64748B',   
  border: '#E2E8F0',      
  blue: '#1A73E8',        
  blueDim: '#F0F6FF',
  green: '#10B981',
  greenDim: '#E6F4EA',
  red: '#EF4444',
  redDim: '#FCE8E6',
};

/* ─── COMPOSANT DROPDOWN OPTIONS (3 POINTS) ─── */
const ActionMenu = ({ client, onAction, onDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemStyle = {
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: C.text,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s',
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: C.textMuted,
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⋮
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          background: '#FFFFFF',
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 100,
          width: '170px',
          padding: '4px 0',
          marginTop: '4px'
        }}>
          <button style={itemStyle} onClick={() => { onAction(client, 'facture'); setIsOpen(false); }}>📄 Facture</button>
          <button style={itemStyle} onClick={() => { onAction(client, 'entree'); setIsOpen(false); }}>📥 Bon d'entrée</button>
          <button style={itemStyle} onClick={() => { onAction(client, 'sortie'); setIsOpen(false); }}>📤 Bon de sortie</button>
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          <button style={{ ...itemStyle, color: C.blue, fontWeight: 500 }} onClick={() => onDetails(client.id)}>Voir Détails →</button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPOSANT (Stock)
   ═══════════════════════════════════════════════ */
const Stock = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formState, setFormState] = useState({ client: null, type: null });
  const [doc, setDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/stock-par-client')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(c => (c.nom || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, minHeight: '100vh', padding: '40px', color: C.text }}>
      <FontLink />

      {/* Header clean matching image_d57a37.jpg */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Inventory Management</h1>
          <p style={{ fontSize: '13px', color: C.textMuted, margin: '4px 0 0 0' }}>Manage your product catalog and stock items by client</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search clients by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${C.border}`, background: '#fff', fontSize: '13px', width: '250px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Mini Stats Badges */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '12px 20px', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: C.textMuted, fontWeight: 500 }}>TOTAL CLIENTS:</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{data.length}</span>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '12px 20px', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: C.textMuted, fontWeight: 500 }}>TOTAL ARTICLES:</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{data.reduce((s, c) => s + (c.articles?.length ?? 0), 0)}</span>
        </div>
      </div>

      {/* Main Container */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: C.textMuted }}>Chargement...</div>
      ) : (
        <div>
          <div style={{ fontSize: '13px', color: C.textMuted, marginBottom: '12px', fontWeight: 500 }}>{filtered.length} clients found</div>
          
          {/* List Wrapper Layout - Clean & Separated */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {filtered.map((client) => {
              const artCount = client.articles?.length ?? 0;
              return (
                <div 
                  key={client.id} 
                  style={{ 
                    background: C.surface, 
                    border: `1px solid ${C.border}`, 
                    borderRadius: '12px', 
                    padding: '16px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Left Side: Client Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.blueDim, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '13px' }}>
                      {client.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: C.text }}>{client.nom}</div>
                      <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>📍 {client.ville || '—'}</span>
                        <span style={{ color: C.border }}>|</span>
                        <span>📦 {artCount} {artCount > 1 ? 'articles' : 'article'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Clean Action Menu */}
                  <ActionMenu 
                    client={client} 
                    onAction={(cl, type) => setFormState({ client: cl, type })} 
                    onDetails={(id) => navigate(`/stock/client/${id}`)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals placeholders */}
      <FormModal client={formState.client} type={formState.type} onClose={() => setFormState({ client: null, type: null })} onSubmit={({ artNom, qty, pu }) => {
        const prefix = formState.type === 'facture' ? 'FA' : formState.type === 'entree' ? 'BE' : 'BS';
        setDoc({ type: formState.type, ref: `${prefix}-${Date.now().toString().slice(-4)}`, date: new Date().toLocaleDateString('fr-FR'), client_nom: formState.client.nom, article_nom: artNom, qty, pu });
        setFormState({ client: null, type: null });
      }} />
      <DocRenderer doc={doc} onClose={() => setDoc(null)} />
    </div>
  );
};

/* ─── FORM MODAL (Sub-component) ─── */
const FormModal = ({ client, type, onClose, onSubmit }) => {
  const [artId, setArtId] = useState('');
  const [qty, setQty] = useState('');
  const [pu, setPu] = useState('');

  if (!client || !type) return null;

  const cfg = {
    facture: { label: 'Nouvelle Facture', color: C.blue, icon: '📄' },
    entree:  { label: "Nouveau Bon d'entrée", color: C.green, icon: '📥' },
    sortie:  { label: 'Nouveau Bon de sortie', color: C.red, icon: '📤' },
  }[type];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!artId) return;
    const selectedArt = client.articles?.find(a => String(a.id) === String(artId));
    const artNom = selectedArt ? (selectedArt.nom || selectedArt.designation) : 'Article';
    onSubmit({ artId, qty: parseInt(qty), pu: parseFloat(pu) || 0, artNom });
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', outline: 'none', marginTop: '6px', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.15)', backdropFilter: 'blur(4px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: cfg.color }}>{cfg.icon}</span> {cfg.label}
            </div>
            <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>Client : {client.nom}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: C.textMuted }}>Article</label>
            <select value={artId} onChange={e => setArtId(e.target.value)} required style={inputStyle}>
              <option value="">— Sélectionner —</option>
              {client.articles?.map(a => (
                <option key={a.id} value={a.id}>{a.nom || a.designation}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: C.textMuted }}>Quantité</label>
              <input type="number" min="1" required value={qty} onChange={e => setQty(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: C.textMuted }}>Prix (DH)</label>
              <input type="number" min="0" step="0.01" required value={pu} onChange={e => setPu(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}`, background: '#fff', color: C.textMuted, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
            <button type="submit" style={{ flex: 1.5, padding: '10px', borderRadius: '8px', border: 'none', background: cfg.color, color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Générer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── DOCUMENT RENDERER (Sub-component) ─── */
const DocRenderer = ({ doc, onClose }) => {
  const printRef = useRef();
  if (!doc) return null;

  const isFacture = doc.type === 'facture';
  const isBE = doc.type === 'entree';
  const typeLabel = isFacture ? 'FACTURE' : isBE ? "BON D'ENTRÉE" : 'BON DE SORTIE';
  const typeColor = isFacture ? C.blue : isBE ? C.green : C.red;

  const ht = doc.qty * doc.pu;
  const tva = isFacture ? ht * 0.20 : 0;
  const totalFinal = isFacture ? ht + tva : ht;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.15)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px', marginBottom: '20px' }}>
          <span style={{ fontWeight: 600 }}>Document généré</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '16px' }}>Fermer</button>
        </div>
        <div style={{ padding: '10px 0' }}>
          <h2 style={{ color: typeColor, margin: 0, fontSize: '20px' }}>{typeLabel}</h2>
          <p style={{ fontSize: '13px', color: C.textMuted, marginTop: '4px' }}>Réf: {doc.ref} | Client: {doc.client_nom}</p>
          <div style={{ marginTop: '16px', background: C.bg, padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
            Article: <strong>{doc.article_nom}</strong> <br/>
            Quantité: {doc.qty} pcs | Total: <strong>{totalFinal.toFixed(2)} DH</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;