import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stock = () => {
  // 1. Initialisez dima b [] bach may-konch undefined f l-bdaya
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5001/api/articles')
      .then(res => {
        // T'akkdi bli res.data ra array
        setArticles(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur Stock:", err);
        setArticles([]);
        setLoading(false);
      });
  }, []);

  // 2. Safely filter: sta3mli articles? bach ila kant undefined may-tla3ch error
  const filteredArticles = (articles || []).filter(art => {
    const name = art.designation || art.nom || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4" style={{ marginLeft: '260px', backgroundColor: '#0f111a', minHeight: '100vh', color: '#fff' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">État de Stock Actuel 📦</h2>
        <input 
          type="text" 
          className="form-control w-25 rounded-pill border-0 shadow-sm px-4" 
          placeholder="Rechercher..." 
          style={{ backgroundColor: '#1e2132', color: '#fff' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#1e2132' }}>
        <table className="table table-hover table-dark mb-0">
          <thead style={{ backgroundColor: '#2d334a' }}>
            <tr className="border-bottom border-secondary text-uppercase small">
              <th className="p-3">Désignation</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3 text-center">Quantité</th>
              <th className="p-3">Prix</th>
              <th className="p-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-5">Chargement...</td></tr>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((art, index) => {
                const qte = parseInt(art.quantite || 0);
                return (
                  <tr key={index} className="border-bottom border-secondary">
                    <td className="p-3 fw-bold">{art.designation || art.nom}</td>
                    <td className="p-3 text-muted small">{art.categorie || 'General'}</td>
                    <td className={`p-3 text-center fw-bold ${qte <= 5 ? 'text-danger' : 'text-success'}`}>
                      {qte}
                    </td>
                    <td className="p-3">{art.prix_achat || art.prix || 0} DH</td>
                    <td className="p-3 text-center">
                      <span className={`badge rounded-pill ${qte === 0 ? 'bg-danger' : qte <= 5 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {qte === 0 ? 'Rupture' : qte <= 5 ? 'Faible' : 'En Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="text-center p-5 text-muted">Aucun article trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 no-print">
        <button className="btn btn-primary px-4 py-2 rounded-pill shadow" onClick={() => window.print()}>
          🖨️ Imprimer l'inventaire
        </button>
      </div>
    </div>
  );
};

export default Stock;