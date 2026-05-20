import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Google Font ─── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
);

/* ─── PALETTE ─── */
const C = {
  bg: '#0F1117',
  surface: '#181C27',
  surfaceHigh: '#1E2333',
  border: 'rgba(255,255,255,0.07)',
  borderMed: 'rgba(255,255,255,0.13)',
  blue: '#3B7FFF',
  blueDim: 'rgba(59,127,255,0.12)',
  green: '#22C97A',
  greenDim: 'rgba(34,201,122,0.12)',
  red: '#FF5C5C',
  redDim: 'rgba(255,92,92,0.12)',
  amber: '#F5A623',
  amberDim: 'rgba(245,166,35,0.12)',
  text: '#ECEEF4',
  textSub: '#8B90A0',
  textHint: '#555B70',
};

/* ─── INLINE STYLES HELPERS ─── */
const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: C.bg,
    minHeight: '100vh',
    padding: '28px 32px',
    color: C.text,
  },
  card: (extra = {}) => ({
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    ...extra,
  }),
  pill: (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.3,
    background: bg,
    color,
  }),
  btn: (bg, color, extra = {}) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '9px 18px',
    borderRadius: 10,
    border: 'none',
    background: bg,
    color,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity .15s, transform .1s',
    ...extra,
  }),
};

/* ═══════════════════════════════════════════════
   DOCUMENT RENDERER (Facture / Bon Entrée / Sortie)
   ═══════════════════════════════════════════════ */
const DocRenderer = ({ doc, onClose }) => {
  const printRef = useRef();
  if (!doc) return null;

  const isFacture = doc.type === 'facture';
  const isBE = doc.type === 'entree';
  const typeLabel = isFacture ? 'FACTURE' : isBE ? "BON D'ENTRÉE" : 'BON DE SORTIE';
  const typeColor = isFacture ? '#3B7FFF' : isBE ? '#22C97A' : '#FF5C5C';

  const ht = doc.qty * doc.pu;
  const tva = isFacture ? ht * 0.20 : 0;
  const ttc = ht + tva;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head>
        <title>${doc.ref}</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'DM Sans',sans-serif;color:#111;background:#fff;padding:40px}
          table{width:100%;border-collapse:collapse}
          th,td{padding:10px 12px;text-align:left;font-size:13px}
          thead tr{background:#f4f6fb}
          tbody tr:nth-child(even){background:#fafbfd}
          .border-b{border-bottom:1px solid #e5e9f2}
          .text-right{text-align:right}
          .mono{font-family:'DM Mono',monospace}
          .label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:4px}
          .val{font-size:13px;color:#111}
          .ttc{background:#111!important;color:#fff;font-weight:600}
          .sig-line{border-top:1px dashed #ccc;width:160px;margin-top:48px}
        </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  };
  const modalStyle = {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 760,
    maxHeight: '92vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };
  const toolbarStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
    position: 'sticky', top: 0, background: '#fff', zIndex: 10,
    borderRadius: '20px 20px 0 0',
  };

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalStyle}>
        {/* Toolbar */}
        <div style={toolbarStyle}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Aperçu du document</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{doc.ref} · {doc.date}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #ddd', background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer' }}>
              Fermer
            </button>
            <button onClick={handlePrint} style={{ padding: '8px 18px', borderRadius: 9, border: 'none', background: '#111', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              🖨️ Imprimer / PDF
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div ref={printRef} style={{ padding: '40px 48px', color: '#111', fontFamily: "'DM Sans', sans-serif" }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 28, borderBottom: '2px solid #111', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: '#111' }}>ISAG STOCK</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Solution de gestion de stock</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 8, lineHeight: 1.8 }}>
                Bd Abdelmoumen N°150, Casablanca<br />
                Tél : +212 522 45 45 80<br />
                contact@isagstock.ma
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: typeColor, letterSpacing: 1 }}>{typeLabel}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: '#555', lineHeight: 1.9 }}>
                <span style={{ fontWeight: 600, color: '#111' }}>Réf :</span> {doc.ref}<br />
                <span style={{ fontWeight: 600, color: '#111' }}>Date :</span> {doc.date}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
            <div style={{ background: '#f7f8fc', borderRadius: 12, padding: '16px 20px' }}>
              <div className="label" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.8px', color: '#888', marginBottom: 8 }}>Destinataire</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#111', marginBottom: 4 }}>{doc.client_nom}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.8 }}>
                {doc.client_adresse}<br />
                I.C.E : {doc.client_ice}<br />
                Ville : {doc.client_ville}
              </div>
            </div>
            <div style={{ background: '#f7f8fc', borderRadius: 12, padding: '16px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.8px', color: '#888', marginBottom: 8 }}>Informations</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.8 }}>
                Dépôt Central Casablanca<br />
                Statut : <span style={{ fontWeight: 600, color: '#22c97a' }}>Confirmé ✓</span><br />
                Mode : B2B Standard
              </div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f2f8' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#555', borderRadius: '8px 0 0 8px' }}>Désignation</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#555' }}>Quantité</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#555' }}>P.U. HT (DH)</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#555', borderRadius: '0 8px 8px 0' }}>Montant HT</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 14px', fontWeight: 500 }}>{doc.article_nom}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>{doc.qty} Pcs</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'DM Mono', monospace" }}>{doc.pu.toFixed(2)}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{ht.toFixed(2)}</td>
              </tr>
              <tr style={{ height: 20 }}><td colSpan={4}></td></tr>
              {isFacture && <>
                <tr style={{ borderTop: '1px solid #eee' }}>
                  <td colSpan={2} style={{ border: 'none' }}></td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontSize: 12, color: '#555', background: '#f7f8fc' }}>Total HT</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontFamily: "'DM Mono', monospace", background: '#f7f8fc' }}>{ht.toFixed(2)} DH</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ border: 'none' }}></td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontSize: 12, color: '#555', background: '#f7f8fc' }}>TVA (20%)</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontFamily: "'DM Mono', monospace", background: '#f7f8fc' }}>{tva.toFixed(2)} DH</td>
                </tr>
              </>}
              <tr>
                <td colSpan={2} style={{ border: 'none' }}></td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, background: '#111', color: '#fff', borderRadius: '8px 0 0 8px' }}>
                  {isFacture ? 'Net à payer TTC' : 'Total'}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: "'DM Mono', monospace", fontWeight: 700, background: '#111', color: '#fff', borderRadius: '0 8px 8px 0' }}>
                  {ttc.toFixed(2)} DH
                </td>
              </tr>
            </tbody>
          </table>

          {/* Arrêt */}
          <div style={{ padding: '10px 14px', background: '#f7f8fc', borderRadius: 8, fontSize: 12, color: '#555', marginBottom: 36 }}>
            Arrêtée la présente opération à la somme de : <strong style={{ color: '#111' }}>{ttc.toFixed(2)} Dirhams {isFacture ? 'TTC' : 'HT'}</strong>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 20 }}>
            {['Signature acheteur', 'Cachet & signature émetteur'].map(lbl => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.6px', color: '#888' }}>{lbl}</div>
                <div style={{ borderTop: '1px dashed #ccc', width: 160, margin: '48px auto 0' }}></div>
              </div>
            ))}
          </div>

          {/* Legal Footer */}
          <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid #eee', fontSize: 10, color: '#999', textAlign: 'center', lineHeight: 1.8 }}>
            ISAG STOCK S.A.R.L — Capital : 100.000,00 DH — Siège : Bd Abdelmoumen N°150, Casablanca<br />
            I.C.E : 001542983000045 · R.C : Casablanca 459122 · I.F : 40221475 · Patente : 36154820 · CNSS : 7412589
          </div>

        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   FORM MODAL
   ═══════════════════════════════════════════════ */
const FormModal = ({ client, type, onClose, onSubmit }) => {
  const [artId, setArtId] = useState('');
  const [qty, setQty] = useState('');
  const [pu, setPu] = useState('');

  if (!client || !type) return null;

  const cfg = {
    facture: { label: 'Créer une facture', color: C.blue, dim: C.blueDim, icon: '📄' },
    entree:  { label: "Bon d'entrée", color: C.green, dim: C.greenDim, icon: '📥' },
    sortie:  { label: 'Bon de sortie', color: C.red, dim: C.redDim, icon: '📤' },
  }[type];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!artId) return;
    const art = client.articles?.find(a => String(a.id) === String(artId)) || { nom: 'Article', id: artId };
    onSubmit({ artId, qty: parseInt(qty), pu: parseFloat(pu) || 0, artNom: art.nom || art.designation });
  };

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 1500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  };
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: `1px solid ${C.borderMed}`,
    background: C.bg,
    color: C.text,
    fontSize: 13,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  };
  const labelStyle = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '.7px', color: C.textSub, marginBottom: 6, display: 'block' };

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.borderMed}`, width: '100%', maxWidth: 420, padding: 28 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>{cfg.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{cfg.label}</span>
            </div>
            <div style={{ fontSize: 12, color: C.textSub }}>Client : <span style={{ color: C.text, fontWeight: 500 }}>{client.nom}</span></div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textSub, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Article */}
          <div>
            <label style={labelStyle}>Article</label>
            <select value={artId} onChange={e => setArtId(e.target.value)} required style={inputStyle}>
              <option value="">— Sélectionner un article —</option>
              {(client.articles && client.articles.length > 0)
                ? client.articles.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nom || a.designation} · {a.pivot?.quantite ?? a.quantite ?? '?'} Pcs
                    </option>
                  ))
                : <option value="DEMO">Article démo (99 Pcs)</option>
              }
            </select>
          </div>

          {/* Qty + PU */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Quantité</label>
              <input type="number" min="1" placeholder="0" required value={qty} onChange={e => setQty(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Prix unitaire (DH)</label>
              <input type="number" min="0" step="0.01" placeholder="0.00" value={pu} onChange={e => setPu(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Preview */}
          {qty && pu && (
            <div style={{ background: C.bg, borderRadius: 10, padding: '12px 16px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textSub, marginBottom: 4 }}>
                <span>Total HT</span>
                <span style={{ fontFamily: 'DM Mono', color: C.text }}>{(qty * pu).toFixed(2)} DH</span>
              </div>
              {type === 'facture' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textSub, marginBottom: 4 }}>
                  <span>TVA 20%</span>
                  <span style={{ fontFamily: 'DM Mono', color: C.amber }}>{(qty * pu * 0.20).toFixed(2)} DH</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 4 }}>
                <span>{type === 'facture' ? 'TTC' : 'Total'}</span>
                <span style={{ fontFamily: 'DM Mono', color: cfg.color }}>
                  {type === 'facture' ? (qty * pu * 1.20).toFixed(2) : (qty * pu).toFixed(2)} DH
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${C.borderMed}`, background: 'transparent', color: C.textSub, fontSize: 13, cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit"
              style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: cfg.color, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Générer le document ↗
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CLIENT CARD
   ═══════════════════════════════════════════════ */
const ClientCard = ({ client, onAction, onDetails, index }) => {
  const [hovered, setHovered] = useState(false);
  const artCount = client.articles?.length ?? 0;

  const avatarColors = ['#3B7FFF', '#22C97A', '#F5A623', '#FF5C5C', '#A78BFA', '#34D399', '#FB923C'];
  const ac = avatarColors[index % avatarColors.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card({
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'border-color .2s, transform .2s',
          borderColor: hovered ? C.borderMed : C.border,
          transform: hovered ? 'translateY(-3px)' : 'none',
          cursor: 'default',
        })
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: ac + '22',
          border: `1.5px solid ${ac}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: ac, flexShrink: 0,
        }}>
          {client.nom.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.nom}</div>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>📍 {client.ville || '—'}</div>
        </div>
        <span style={S.pill(C.blueDim, C.blue)}>{artCount} prod</span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.border }} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { type: 'facture', label: 'Facture', icon: '📄', color: C.blue, dim: C.blueDim },
          { type: 'entree', label: "Bon d'entrée", icon: '📥', color: C.green, dim: C.greenDim },
          { type: 'sortie', label: 'Bon de sortie', icon: '📤', color: C.red, dim: C.redDim },
        ].map(({ type, label, icon, color, dim }) => (
          <button key={type} onClick={() => onAction(client, type)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', borderRadius: 9,
              border: `1px solid transparent`,
              background: dim, color,
              fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              transition: 'filter .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
            <span style={{ marginLeft: 'auto', opacity: .5, fontSize: 11 }}>›</span>
          </button>
        ))}
      </div>

      {/* Details Button */}
      <button onClick={() => onDetails(client.id)}
        style={{
          marginTop: 'auto',
          padding: '10px', borderRadius: 10,
          border: `1px solid ${C.borderMed}`,
          background: C.surfaceHigh, color: C.text,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'background .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.border}
        onMouseLeave={e => e.currentTarget.style.background = C.surfaceHigh}
      >
        Voir détails →
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const Stock = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [formState, setFormState] = useState({ client: null, type: null });
  const [doc, setDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/stock-par-client')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(c =>
    (c.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.ville || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 8);

  const handleAction = (client, type) => setFormState({ client, type });
  const closeForm = () => setFormState({ client: null, type: null });

  const handleGenerate = ({ artId, qty, pu, artNom }) => {
    const client = formState.client;
    const type = formState.type;
    const prefix = type === 'facture' ? 'FA' : type === 'entree' ? 'BE' : 'BS';
    const ref = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('fr-FR');
    setDoc({
      type, ref, date: today,
      client_nom: client.nom,
      client_ville: client.ville || '—',
      client_ice: client.ice || '—',
      client_adresse: client.adresse || '—',
      article_nom: artNom,
      qty, pu,
    });
    closeForm();
  };

  /* ── Stats bar ── */
  const totalArticles = data.reduce((s, c) => s + (c.articles?.length ?? 0), 0);
  const stats = [
    { label: 'Partenaires', value: data.length, color: C.blue },
    { label: 'Articles en stock', value: totalArticles, color: C.green },
    { label: 'Sans article', value: data.filter(c => !c.articles?.length).length, color: C.amber },
  ];

  return (
    <div style={S.page}>
      <FontLink />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, boxShadow: `0 0 10px ${C.blue}` }} />
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>État de stock par client</h1>
          </div>
          <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>Statistiques d'inventaire par partenaire commercial</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: C.textHint }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowAll(false); }}
            style={{
              padding: '10px 16px 10px 40px',
              borderRadius: 12,
              border: `1px solid ${C.borderMed}`,
              background: C.surface,
              color: C.text,
              fontSize: 13,
              width: 270,
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{
            ...S.card({ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, flex: '1 1 150px', minWidth: 140 })
          }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: color }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, fontFamily: 'DM Mono', color }}>{value}</div>
              <div style={{ fontSize: 11, color: C.textSub, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
          Chargement des données...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card({ textAlign: 'center', padding: '60px 20px' }) }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 600, color: C.text }}>Aucun partenaire trouvé</div>
          <div style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>Modifiez votre recherche</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {displayed.map((c, i) => (
              <ClientCard key={c.id} client={c} index={i} onAction={handleAction} onDetails={id => navigate(`/stock/client/${id}`)} />
            ))}
          </div>

          {filtered.length > 8 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 24,
                  border: `1px solid ${C.borderMed}`,
                  background: C.surface,
                  color: C.textSub,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {showAll ? 'Voir moins ↑' : `Voir tous les partenaires (${filtered.length}) ↓`}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Modals ── */}
      <FormModal client={formState.client} type={formState.type} onClose={closeForm} onSubmit={handleGenerate} />
      <DocRenderer doc={doc} onClose={() => setDoc(null)} />
    </div>
  );
};

export default Stock;
