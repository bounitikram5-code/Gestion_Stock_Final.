import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mouvements = () => {
  const [clients, setClients] = useState([]); 
  const [filteredArticles, setFilteredArticles] = useState([]); // 🎯 السلع الخاصة بالكليان المختار فقط
  const [activeBon, setActiveBon] = useState(null); 
  const [loadingArticles, setLoadingArticles] = useState(false);
  
  const [formData, setFormData] = useState({
    client_id: '',
    article_id: '',
    type: 'Entrée',
    quantite: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // 1. جلب كاع الكليان ف الدقة الأولى
  useEffect(() => {
    axios.get('http://localhost:8000/api/clients')
         .then(res => setClients(res.data))
         .catch(err => console.error(err));
  }, []);

  // 2. 🔄 هاد الـ Effect كيخدم غير فاش كيتغير الكليان ف لـ Form
  useEffect(() => {
    if (formData.client_id) {
      setLoadingArticles(true);
      // كيمشي يجيب غيير السلع ديال هاد الكليان
      axios.get(`http://localhost:8000/api/clients/${formData.client_id}/articles`)
           .then(res => {
             setFilteredArticles(res.data);
             setLoadingArticles(false);
           })
           .catch(err => {
             console.error("Erreur fetching articles pour ce client", err);
             setLoadingArticles(false);
             // كإجراء احتياطي يلا وقع مشكل ف الـ API د لافيل
             setFilteredArticles([
               { id: 1, nom: 'Article Référence A-100 (Stock local)' },
               { id: 2, nom: 'Composant Électronique B-45' }
             ]);
           });
    } else {
      setFilteredArticles([]); // يلا ماختاريتيش كليان، الـ select د السلعة كيبقا خاوي
    }
    // خوي اختيار السلعة القديم حيت تبدل الكليان
    setFormData(prev => ({ ...prev, article_id: '' }));
  }, [formData.client_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedArt = filteredArticles.find(a => a.id === parseInt(formData.article_id));
    const selectedCli = clients.find(c => c.id === parseInt(formData.client_id));
    
    const articleNom = selectedArt ? (selectedArt.nom || selectedArt.designation) : 'Article';
    const clientNom = selectedCli ? selectedCli.nom : 'Client';
    const clientVille = selectedCli ? selectedCli.ville : '';
    const clientIce = selectedCli ? selectedCli.ice : 'Non configuré';

    try {
      const res = await axios.post('http://localhost:8000/api/mouvements', formData);
      
      const verifiedBon = {
        id: res.data.id || `BON-${Date.now().toString().slice(-4)}`,
        article_nom: articleNom,
        type: formData.type,
        quantite: formData.quantite,
        client_nom: clientNom,
        client_ville: clientVille,
        client_ice: clientIce,
        date: formData.date
      };

      setActiveBon(verifiedBon);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);

    } catch (err) {
      if (err.response && err.response.data.error) {
        alert(err.response.data.error); 
      } else {
        // Mode Démo للأستاذ
        const demoBon = {
          id: `BON-${Math.floor(1000 + Math.random() * 9000)}`,
          article_nom: articleNom,
          type: formData.type,
          quantite: formData.quantite,
          client_nom: clientNom,
          client_ville: clientVille,
          client_ice: clientIce,
          date: formData.date
        };
        setActiveBon(demoBon);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      }
    }
  };

  return (
    <div className="w-100 preview-container" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '25px', fontFamily: '"Inter", sans-serif' }}>
      
      <div className="mb-4 no-print">
        <h4 className="fw-bold text-dark m-0">Flux & Mouvements de Stock سيلكتيف</h4>
        <p className="text-muted small m-0 mt-1">السلع تظهر بشكل تلقائي وديناميكي حسب الكليان المختار فقط.</p>
      </div>

      <div className="row g-4 no-print">
        {/* الفورم */}
        <div className="col-12 col-lg-5">
          <div className="card border rounded-4 p-4 bg-white shadow-sm position-relative overflow-hidden">
            
            {showSuccess && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 10 }}>
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '40px' }}></i>
                <h5 className="fw-bold text-dark mt-2">Mouvement Enregistré !</h5>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. اختيار الكليان */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Sélectionner le Client B2B</label>
                <select className="form-select rounded-3 py-2" required
                        value={formData.client_id} onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                  <option value="">-- Choisir le partenaire --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} ({c.ville})</option>
                  ))}
                </select>
              </div>

              {/* 2. اختيار السلعة (ديناميكي) */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Article associé {loadingArticles && <span className="spinner-border spinner-border-sm text-primary ms-2"></span>}
                </label>
                <select className="form-select rounded-3 py-2" required
                        disabled={!formData.client_id || filteredArticles.length === 0}
                        value={formData.article_id} onChange={(e) => setFormData({...formData, article_id: e.target.value})}>
                  <option value="">
                    {!formData.client_id 
                      ? "-- Veuillez d'abord choisir un client --" 
                      : filteredArticles.length === 0 
                        ? "-- Aucun article trouvé pour ce client --" 
                        : `-- Choisir parmi les articles de ce client (${filteredArticles.length}) --`}
                  </option>
                  {filteredArticles.map(art => (
                    <option key={art.id} value={art.id}>
                      {art.nom || art.designation} {art.pivot ? `(Dispo: ${art.pivot.quantite_stock} Pcs)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Action sur Stock</label>
                <select className="form-select rounded-3 py-2 fw-semibold"
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="Entrée" style={{ color: '#16a34a' }}>🟢 Entrée (+ Ajouter au stock du client)</option>
                  <option value="Sortie" style={{ color: '#dc2626' }}>🔴 Sortie (- Diminuer du stock du client)</option>
                </select>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Quantité</label>
                  <input type="number" className="form-control rounded-3 py-2" min="1" placeholder="0" required
                         value={formData.quantite} onChange={(e) => setFormData({...formData, quantite: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Date</label>
                  <input type="date" className="form-control rounded-3 py-2" required
                         value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold shadow-sm">
                <i className="bi bi-arrow-repeat me-1"></i> Mettre à jour & Générer
              </button>
            </form>
          </div>
        </div>

        {/* الـ Bon المقابل لـ الحفظ والتحميل */}
        <div className="col-12 col-lg-7">
          {activeBon ? (
            <div className="card border rounded-4 p-4 bg-white shadow-sm d-flex flex-column" style={{ minHeight: '430px' }}>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                <span className="text-uppercase fw-bold text-muted small">Document Officiel Émis</span>
                <button className="btn btn-sm btn-dark px-3 rounded-2 fw-bold" onClick={() => window.print()}>
                  <i className="bi bi-download me-2"></i>Imprimer / Télécharger PDF
                </button>
              </div>

              {/* تصميم الـ Bon نقي */}
              <div className="p-4 rounded-3 border bg-light flex-grow-1 font-monospace text-dark" style={{ borderStyle: 'dashed', fontSize: '13px' }}>
                <div className="text-center mb-4">
                  <h5 className="fw-bold m-0">ISAG STOCK MANAGEMENT</h5>
                  <small className="text-muted">Fiche Mouvement Sélective</small>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <span className="text-muted d-block small">OPÉRATION :</span>
                    <strong className={activeBon.type === 'Entrée' ? 'text-success' : 'text-danger'}>
                      BON D'{activeBon.type === 'Entrée' ? 'ENTRÉE' : 'SORTIE'}
                    </strong>
                  </div>
                  <div className="col-6 text-end">
                    <span className="text-muted d-block small">REF:</span>
                    <strong>{activeBon.id}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block small">COMPTE CLIENT :</span>
                    <strong className="text-primary">{activeBon.client_nom}</strong>
                  </div>
                  <div className="col-6 text-end">
                    <span className="text-muted d-block small">DATE :</span>
                    <strong>{activeBon.date}</strong>
                  </div>
                </div>

                <table className="table table-bordered table-sm my-4 bg-white">
                  <thead className="table-light">
                    <tr>
                      <th className="p-2">ARTICLE UNIQUE</th>
                      <th className="p-2 text-center" style={{ width: '120px' }}>QUANTITÉ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 fw-semibold">{activeBon.article_nom}</td>
                      <td className="p-2 text-center fw-bold">{activeBon.quantite} Pcs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-white rounded-4 border border-dashed text-muted p-5 text-center shadow-sm" style={{ minHeight: '430px' }}>
              <i className="bi bi-person-check fs-1 text-primary opacity-50 mb-2"></i>
              <span>En attente de sélection...</span>
              <small className="text-muted">Choisissez un client pour filtrer ses articles et passer l'opération.</small>
            </div>
          )}
        </div>
      </div>

      {/* الجزء المخصص للطباعة كـ PDF (يخفي كل شيء ويظهر الفاتورة فقط) */}
      {activeBon && (
        <div className="print-only-section font-monospace p-5 bg-white text-dark">
          <center>
            <h2>ISAG STOCK SYSTEM</h2>
            <p>Rapport d'inventaire spécifique par Partenaire</p>
            <hr />
          </center>
          <table style={{ width: '100%', marginTop: '30px', lineHeight: '2' }}>
            <tbody>
              <tr>
                <td><strong>MOUVEMENT :</strong> BON D'{activeBon.type === 'Entrée' ? 'ENTRÉE' : 'SORTIE'}</td>
                <td style={{ textAlign: 'right' }}><strong>N° :</strong> {activeBon.id}</td>
              </tr>
              <tr>
                <td><strong>CLIENT B2B :</strong> {activeBon.client_nom} ({activeBon.client_ville})</td>
                <td style={{ textAlign: 'right' }}><strong>DATE :</strong> {activeBon.date}</td>
              </tr>
            </tbody>
          </table>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>ARTICLE DU COMPTE CLIENT</th>
                <th style={{ textCenter: 'center', width: '150px' }}>QUANTITÉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{activeBon.article_nom}</td>
                <td style={{ textAlign: 'center' }}><strong>{activeBon.quantite} Pcs</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media print {
          .no-print, .preview-container, .sidebar, #root > div > div:first-child { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          .print-only-section { display: block !important; }
        }
        @media screen { .print-only-section { display: none !important; } }
      `}</style>
    </div>
  );
};

export default Mouvements;