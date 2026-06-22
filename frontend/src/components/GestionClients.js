import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GestionClients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("fiscal");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = "http://127.0.0.1:8000";

  const fetchClients = useCallback(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setClients(res.data);
        if (res.data.length > 0 && !selectedClient) {
          setSelectedClient(res.data[0]);
        }
      })
      .catch(err => console.error("Erreur backend:", err));
  }, []); // eslint-disable-line

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/clients/${selectedClient.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal(false);
      setSelectedClient(null);
      showToast(`Client "${selectedClient.nom}" supprimé avec succès`);
      fetchClients();
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const filteredClients = clients.filter(c =>
    (c.nom && c.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.ville && c.ville.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-100" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '25px' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: '#fff', border: '1.5px solid #E4EAF6',
          borderRadius: 12, padding: '12px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          fontSize: 13, fontWeight: 500, color: '#0F172A',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            border: '1.5px solid #E4EAF6',
            width: '100%', maxWidth: 420,
            padding: 32,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            animation: 'modalIn .2s ease',
          }}>
            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#FEF2F2', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>
                Supprimer ce partenaire ?
              </h3>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                Vous êtes sur le point de supprimer <strong style={{ color: '#DC2626' }}>{selectedClient?.nom}</strong>.<br/>
                Cette action est <strong>irréversible</strong> — toutes les données associées seront perdues.
              </p>
            </div>

            {/* Client info */}
            <div style={{
              background: '#F8FAFC', borderRadius: 12, padding: '12px 16px',
              border: '1px solid #E4EAF6', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#DC2626', flexShrink: 0,
              }}>
                {selectedClient?.nom?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 14 }}>{selectedClient?.nom}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{selectedClient?.ville || '—'} · {selectedClient?.email || 'Pas d\'email'}</div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1.5px solid #E4EAF6', background: '#fff',
                  color: '#64748B', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: 'none',
                  background: deleting ? '#FCA5A5' : '#DC2626',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  transition: 'all .15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#B91C1C'; }}
                onMouseLeave={e => { if (!deleting) e.currentTarget.style.background = '#DC2626'; }}
              >
                {deleting ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".7s" repeatCount="indefinite"/>
                      </path>
                    </svg>
                    Suppression...
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                    Oui, supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold m-0" style={{ color: '#0F172A', letterSpacing: '-0.5px' }}>
            Portefeuille & Stocks Partenaires
          </h4>
          <p className="text-muted small m-0 mt-1" style={{ fontSize: '13px' }}>
            Console d'administration B2B : Suivi fiscal, registres de commerce et articles associés.
          </p>
        </div>
        <button className="btn px-4 py-2 fw-semibold d-flex align-items-center gap-2 enterprise-btn-dark"
                onClick={() => navigate('/clients/add')}>
          <i className="bi bi-plus-lg"></i> Ajouter un compte
        </button>
      </div>

      <div className="row g-4">
        {/* ── Left: Client List ── */}
        <div className="col-12 col-xl-4 d-flex flex-column" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="input-group mb-3 border rounded-3 bg-white px-3 py-1 align-items-center" style={{ borderColor: '#E2E8F0' }}>
            <i className="bi bi-search text-muted me-2"></i>
            <input type="text" className="form-control border-0 bg-transparent p-1 small"
                   placeholder="Rechercher une entreprise, ville..."
                   style={{ fontSize: '13px', boxShadow: 'none' }}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="flex-grow-1 overflow-auto pe-1 d-flex flex-column gap-2" style={{ maxHeight: '72vh' }}>
            {filteredClients.map(c => (
              <div key={c.id}
                   className={`d-flex align-items-center p-3 rounded-3 list-partner-item ${selectedClient?.id === c.id ? 'partner-active' : ''}`}
                   onClick={() => setSelectedClient(c)}
                   style={{ cursor: 'pointer' }}>
                <div className="rounded-2 d-flex align-items-center justify-content-center overflow-hidden me-3 border"
                     style={{ width: '42px', height: '42px', backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', flexShrink: 0 }}>
                  {c.logo ? (
                    <img src={`${API_BASE_URL}/storage/${c.logo}`} className="w-100 h-100 object-fit-cover" alt="" />
                  ) : (
                    <span className="fw-bold text-secondary" style={{ fontSize: '14px' }}>{c.nom?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-grow-1 text-truncate">
                  <span className="fw-semibold d-block text-dark" style={{ fontSize: '14px' }}>{c.nom}</span>
                  <span className="text-muted text-uppercase fw-medium" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    <i className="bi bi-geo-alt me-1"></i>{c.ville || '—'}
                  </span>
                </div>
                <i className="bi bi-chevron-right text-muted opacity-40 arrow-slide"></i>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Client Detail ── */}
        <div className="col-12 col-xl-8">
          {selectedClient ? (
            <div className="card border rounded-4 p-4 bg-white shadow-sm d-flex flex-column animate-layout" style={{ borderColor: '#E2E8F0' }}>

              {/* Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pb-4 border-bottom mb-4 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                       style={{ width: '56px', height: '56px', borderColor: '#E2E8F0', fontSize: '20px', fontWeight: 'bold', color: '#0F172A' }}>
                    {selectedClient.nom?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark m-0">{selectedClient.nom}</h4>
                    <span className="text-muted small">Partenaire B2B Officiel</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-light border rounded-3 px-3 py-2 fw-medium" style={{ fontSize: '12.5px' }}
                          onClick={() => navigate(`/clients/edit/${selectedClient.id}`)}>
                    <i className="bi bi-pencil me-1"></i> Modifier
                  </button>
                  <button
                    className="btn btn-sm px-3 py-2 fw-medium rounded-3"
                    style={{ fontSize: '12.5px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                    onClick={() => setDeleteModal(true)}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                  >
                    <i className="bi bi-trash me-1"></i> Supprimer
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="d-flex gap-2 mb-4 p-1 bg-light rounded-3" style={{ width: 'fit-content' }}>
                <button className={`btn btn-sm px-3 py-1 rounded-2 fw-semibold ${activeTab === 'fiscal' ? 'bg-white text-dark shadow-sm' : 'text-secondary border-0'}`}
                        onClick={() => setActiveTab('fiscal')} style={{ fontSize: '12.5px' }}>
                  <i className="bi bi-file-earmark-text me-1"></i> Données Fiscales
                </button>
                <button className={`btn btn-sm px-3 py-1 rounded-2 fw-semibold ${activeTab === 'stocks' ? 'bg-white text-dark shadow-sm' : 'text-secondary border-0'}`}
                        onClick={() => setActiveTab('stocks')} style={{ fontSize: '12.5px' }}>
                  <i className="bi bi-box-seam me-1"></i> Stocks & Articles
                </button>
              </div>

              {/* Fiscal Tab */}
              {activeTab === 'fiscal' ? (
                <div className="row g-4 animate-layout">
                  <div className="col-12 col-md-7">
                    <h6 className="text-secondary fw-bold text-uppercase mb-3" style={{ fontSize: '11px' }}>Identifiants d'Enregistrement</h6>
                    <div className="p-3 mb-3 rounded-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="text-muted small mb-1" style={{ fontSize: '11px' }}>I.C.E</div>
                      <span className="font-monospace fw-bold text-dark fs-6">{selectedClient.ice || '—'}</span>
                    </div>
                    <div className="p-3 mb-3 rounded-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="text-muted small mb-1" style={{ fontSize: '11px' }}>Adresse</div>
                      <span className="text-dark fw-medium small d-block">{selectedClient.adresse || '—'}</span>
                    </div>
                    <div className="row g-2">
                      {[
                        { label: 'Identifiant Fiscal', val: selectedClient.identifiant_fiscal },
                        { label: 'R.C', val: selectedClient.rc },
                        { label: 'Patente', val: selectedClient.patente },
                      ].map(({ label, val }) => (
                        <div className="col-4" key={label}>
                          <div className="p-2 rounded-3 border bg-white text-center">
                            <div className="text-muted" style={{ fontSize: '10px' }}>{label}</div>
                            <span className="font-monospace small fw-bold text-dark text-truncate d-block mt-1">{val || '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-md-5" style={{ borderLeft: '1px solid #F1F5F9' }}>
                    <h6 className="text-secondary fw-bold text-uppercase mb-3 px-1" style={{ fontSize: '11px' }}>Coordonnées</h6>
                    <div className="d-flex flex-column gap-3 p-2">
                      {[
                        { icon: 'bi-geo-alt-fill text-primary', label: 'Ville', val: selectedClient.ville },
                        { icon: 'bi-telephone-fill text-success', label: 'Téléphone', val: selectedClient.telephone },
                        { icon: 'bi-envelope-fill text-warning', label: 'Email', val: selectedClient.email },
                      ].map(({ icon, label, val }) => (
                        <div className="d-flex align-items-center gap-3" key={label}>
                          <div className="bg-light rounded-2 d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
                            <i className={`bi ${icon}`}></i>
                          </div>
                          <div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{label}</div>
                            <span className="text-dark small fw-bold">{val || '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-layout">
                  <h6 className="text-secondary fw-bold text-uppercase mb-3" style={{ fontSize: '11px' }}>Articles Associés</h6>
                  <div className="table-responsive rounded-3 border bg-white">
                    <table className="table table-hover align-middle m-0" style={{ fontSize: '13px' }}>
                      <thead className="table-light">
                        <tr>
                          <th className="py-3 px-3 text-secondary fw-600">DÉSIGNATION</th>
                          <th className="py-3 text-secondary fw-600">PRIX</th>
                          <th className="py-3 text-secondary fw-600">QUANTITÉ</th>
                          <th className="py-3 text-end px-3 text-secondary fw-600">STATUT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClient.articles && selectedClient.articles.length > 0 ? (
                          selectedClient.articles.map((art, idx) => (
                            <tr key={idx}>
                              <td className="fw-semibold text-dark px-3">{art.nom || art.designation}</td>
                              <td className="font-monospace fw-medium text-secondary">{parseFloat(art.prix || 0).toFixed(2)} DH</td>
                              <td className="font-monospace fw-bold text-dark">{art.quantite} Pcs</td>
                              <td className="text-end px-3">
                                <span className={`badge rounded-pill px-2 py-1 ${art.quantite > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                  {art.quantite > 0 ? 'En Stock' : 'Rupture'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted py-4" style={{ fontSize: 13 }}>
                              Aucun article associé à ce partenaire
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center bg-white rounded-4 border text-muted p-5">
              Sélectionnez un partenaire pour charger ses données.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)} }
        .enterprise-btn-dark { background-color:#0F172A;color:white;border-radius:8px;font-size:13px;transition:all .2s; }
        .enterprise-btn-dark:hover { background-color:#1E293B;color:white; }
        .list-partner-item { border:1px solid transparent;border-radius:10px;transition:all .2s ease;background-color:transparent; }
        .list-partner-item:hover:not(.partner-active) { background-color:#E2E8F0!important; }
        .partner-active { background-color:#FFFFFF!important;border-color:#E2E8F0!important;box-shadow:0 4px 12px rgba(0,0,0,.03)!important; }
        .partner-active .arrow-slide { transform:translateX(3px);color:#0F172A!important;opacity:1!important; }
        .animate-layout { animation:slideUp .2s cubic-bezier(.4,0,.2,1); }
        @keyframes slideUp { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px}
      `}</style>
    </div>
  );
};

export default GestionClients;
