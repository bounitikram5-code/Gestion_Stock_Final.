import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const C = {
  bg:         '#F8FAFC',
  surface:    '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border:     '#E2E8F0',
  blue:       '#2563EB',
  blueSoft:   '#EFF6FF',
  blueText:   '#1E40AF',
  green:      '#10B981',
  greenSoft:  '#ECFDF5',
  greenText:  '#065F46',
  red:        '#EF4444',
  redSoft:    '#FEF2F2',
  redText:    '#991B1B',
  amber:      '#F59E0B',
  amberSoft:  '#FFFBEB',
  amberText:  '#92400E',
  text:       '#0F172A',
  textSub:    '#475569',
  textHint:   '#94A3B8',
  shadow:     '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  shadowLg:   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

const Icon = ({ path, size = 18, color = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(path) ? path : [path]).map((d, i) => <path key={i} d={d} />)}
  </svg>
);

const ICONS = {
  box:     ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', 'M3.27 6.96L12 12.01l8.73-5.05', 'M12 22.08V12'],
  stock:   ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  alert:   ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  ban:     ['M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'],
  pdf:     ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  search:  ['M21 21l-4.35-4.35', 'M11 19A8 8 0 1011 3a8 8 0 000 16z'],
  clients: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 7a4 4 0 100 8 4 4 0 000-8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'],
  trend:   ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
  check:   ['M20 6L9 17l-5-5'],
  eye:     ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  bell:    ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
  close:   ['M18 6L6 18', 'M6 6l12 12'],
};

const StatCard = ({ label, value, icon, bg, color, sub, trend }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: '24px',
    boxShadow: C.shadow, flex: '1 1 220px',
    position: 'relative', overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>{label}</span>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon path={icon} size={20} color={color} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: '-0.5px' }}>{value}</div>
      {trend !== undefined && (
        <span style={{ fontSize: 12, fontWeight: 600, color: C.green, background: C.greenSoft, padding: '2px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon path={ICONS.trend} size={12} color={C.green} strokeWidth={2.5} />
          {trend}%
        </span>
      )}
    </div>
    {sub && <div style={{ fontSize: 12, color: C.textHint, marginTop: 8 }}>{sub}</div>}
  </div>
);

const Dashboard = () => {
  const [articles, setArticles]   = useState([]);
  const [clients, setClients]     = useState([]);
  const [mouvements, setMouv]     = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAlertModal, setShowAlertModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/articles', { headers: h }),
      axios.get('http://127.0.0.1:8000/api/clients',  { headers: h }),
      axios.get('http://127.0.0.1:8000/api/mouvements', { headers: h }),
    ]).then(([ra, rc, rm]) => {
      setArticles(ra.data);
      setClients(rc.data);
      setMouv(rm.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const lowStock   = articles.filter(a => a.quantite > 0 && a.quantite < 5);
  const outOfStock = articles.filter(a => a.quantite <= 0);
  const totalQty   = articles.reduce((s, a) => s + parseInt(a.quantite || 0), 0);

  const alertAll = [...lowStock, ...outOfStock];
  const alertFiltered = alertAll
    .filter(a => activeTab === 'all' || (activeTab === 'low' ? a.quantite > 0 : a.quantite <= 0))
    .filter(a => a.nom?.toLowerCase().includes(search.toLowerCase()));

  const pieData = [
    { name: 'Normal',    value: Math.max(0, articles.length - lowStock.length - outOfStock.length) },
    { name: 'Stock bas', value: lowStock.length },
    { name: 'Rupture',   value: outOfStock.length },
  ];
  const PIE_COLORS = ['#2563EB', '#F59E0B', '#EF4444'];

  const barData = articles.slice(0, 6).map(a => ({
    name: (a.nom || '').slice(0, 8),
    val: parseInt(a.quantite || 0),
  }));

  const areaData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const dayMouv = mouvements.filter(m => m.date === d.toISOString().split('T')[0]);
    return {
      date: label,
      entrees: dayMouv.filter(m => m.type?.includes('Entrée')).length,
      sorties: dayMouv.filter(m => m.type?.includes('Sortie')).length,
    };
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Rapport d'Alertes Stock — ISAG STOCK", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, 14, 30);
    autoTable(doc, {
      head: [['Article', 'Client', 'Quantité', 'Statut']],
      body: alertAll.map(a => [a.nom, a.client?.nom || '—', a.quantite, a.quantite <= 0 ? 'Rupture' : 'Stock bas']),
      startY: 38,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save('Rapport_Alertes_ISAG.pdf');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px', fontSize: 12, boxShadow: C.shadowLg }}>
        <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textSub, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span>{p.name}: <strong>{p.value}</strong></span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, minHeight: '100vh', padding: '32px', color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.5, color: C.text }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: C.textSub, margin: 0 }}>
            Bienvenue, <strong style={{ color: C.blue }}>{user.name}</strong> — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Icon path={ICONS.search} size={16} color={C.textHint} />
            </div>
            <input type="text" placeholder="Rechercher un article..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 16px 10px 40px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 14, outline: 'none', width: 240, fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onFocus={e => { e.target.style.borderColor = C.blue; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          
          <button 
            onClick={() => setShowAlertModal(true)}
            style={{ 
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: 42, height: 42, borderRadius: 12, border: `1px solid ${C.border}`, 
              background: C.surface, cursor: 'pointer', transition: 'background 0.2s' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
            onMouseLeave={e => e.currentTarget.style.background = C.surface}
          >
            <Icon path={ICONS.bell} size={20} color={alertAll.length > 0 ? C.red : C.textSub} />
            {alertAll.length > 0 && (
              <span style={{ 
                position: 'absolute', top: -4, right: -4, background: C.red, color: '#fff', 
                fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 6px', 
                border: `2px solid ${C.surface}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
              }}>
                {alertAll.length}
              </span>
            )}
          </button>

          <button onClick={exportToPDF} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: C.blue, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)', transition: 'opacity 0.2s' }}>
            <Icon path={ICONS.pdf} size={16} color="#fff" />
            Exporter PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total articles"   value={articles.length}    icon={ICONS.box}     bg={C.blueSoft}  color={C.blue}  sub={`${totalQty} unités en stock`} />
        <StatCard label="Partenaires"       value={clients.length}     icon={ICONS.clients}  bg={C.greenSoft} color={C.green} sub="clients actifs" />
        <StatCard label="Stock bas"         value={lowStock.length}    icon={ICONS.alert}   bg={C.amberSoft} color={C.amber} sub="< 5 unités" />
        <StatCard label="Rupture de stock"  value={outOfStock.length}  icon={ICONS.ban}     bg={C.redSoft}   color={C.red}   sub="0 unité disponible" />
      </div>

    
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px,1fr))', gap: 24 }}>
        
        {/* Mouvements Chart */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', boxShadow: C.shadow, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.text }}>Activité des mouvements</h3>
              <p style={{ fontSize: 13, color: C.textSub, margin: '4px 0 0' }}>Entrées et sorties des 7 derniers jours</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ label: 'Entrées', color: C.green }, { label: 'Sorties', color: C.red }].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textSub }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.red} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={C.red} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: C.textSub }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: C.textSub }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="entrees" name="Entrées" stroke={C.green} strokeWidth={2.5} fill="url(#gE)" dot={false} activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="sorties" name="Sorties" stroke={C.red}   strokeWidth={2.5} fill="url(#gS)" dot={false} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

     
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', boxShadow: C.shadow }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.text }}>Répartition du stock</h3>
          <p style={{ fontSize: 13, color: C.textSub, margin: '4px 0 16px' }}>Distribution par statut</p>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px', fontSize: 12, boxShadow: C.shadowLg }}>
                    <span style={{ fontWeight: 600 }}>{payload[0].name}: {payload[0].value} articles</span>
                  </div>
                ) : null} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 2 ? `1px dashed ${C.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i] }} />
                  <span style={{ fontSize: 13, color: C.textSub }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      {showAlertModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ 
            background: C.surface, width: '90%', maxWidth: '900px', maxHeight: '85vh', 
            borderRadius: 20, boxShadow: C.shadowLg, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', border: `1px solid ${C.border}`
          }}>
            
            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon path={ICONS.alert} size={20} color={C.red} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: C.text }}>Alertes de stock</h3>
                  <p style={{ fontSize: 13, color: C.textSub, margin: '2px 0 0' }}>Articles nécessitant un réapprovisionnement immédiat</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Tabs Filter */}
                <div style={{ display: 'flex', gap: 4, background: C.surfaceAlt, borderRadius: 10, padding: 4 }}>
                  {[
                    { id: 'all', label: `Tout (${alertAll.length})` },
                    { id: 'low', label: `Stock bas (${lowStock.length})` },
                    { id: 'out', label: `Rupture (${outOfStock.length})` },
                  ].map(({ id, label }) => (
                    <button key={id} onClick={() => setActiveTab(id)} style={{
                      padding: '6px 14px', borderRadius: 8, border: 'none',
                      background: activeTab === id ? C.surface : 'transparent',
                      color: activeTab === id ? C.text : C.textSub,
                      fontSize: 12, fontWeight: activeTab === id ? 600 : 500,
                      cursor: 'pointer', boxShadow: activeTab === id ? C.shadow : 'none',
                      transition: 'all 0.15s',
                    }}>{label}</button>
                  ))}
                </div>

                <button 
                  onClick={() => setShowAlertModal(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.textHint, padding: 4 }}
                >
                  <Icon path={ICONS.close} size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body (Table) */}
            <div style={{ overflowY: 'auto', padding: '0 12px 20px 12px', background: '#FAFAFA' }}>
              {alertFiltered.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.greenSoft, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon path={ICONS.check} size={24} color={C.green} />
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 16, color: C.text }}>Aucune alerte trouvée</h4>
                  <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>Filtre vide ou stock entièrement normal.</p>
                </div>
              ) : (
                <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, marginTop: 16, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
                        {['Article', 'Client', 'Catégorie', 'Quantité', 'Statut', 'Action'].map(h => (
                          <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.textSub, fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {alertFiltered.map((art) => {
                        const isOut = art.quantite <= 0;
                        const sBg    = isOut ? C.redSoft   : C.amberSoft;
                        const sColor = isOut ? C.red        : C.amber;
                        const sLabel = isOut ? 'Rupture'    : 'Stock bas';
                        return (
                          <tr key={art.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: sBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Icon path={ICONS.box} size={16} color={sColor} />
                                </div>
                                <span style={{ fontWeight: 600, color: C.text }}>{art.nom}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px', color: C.textSub }}>{art.client?.nom || '—'}</td>
                            <td style={{ padding: '14px 20px' }}>
                              {art.categorie 
                                ? <span style={{ padding: '4px 10px', borderRadius: 12, background: C.blueSoft, color: C.blueText, fontSize: 12, fontWeight: 500 }}>{art.categorie}</span>
                                : <span style={{ color: C.textHint }}>—</span>
                              }
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ fontWeight: 700, color: sColor, fontSize: 15 }}>{art.quantite}</span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 12, background: sBg, color: sColor, fontSize: 12, fontWeight: 600 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: sColor }} />
                                {sLabel}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <a href={`/articles/edit/${art.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                                <Icon path={ICONS.eye} size={14} />
                                Voir
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;