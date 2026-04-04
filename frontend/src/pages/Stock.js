import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stock = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/articles')
      .then(res => {
        setArticles(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur Stock:", err);
        setArticles([]);
        setLoading(false);
      });
  }, []);

  const filteredArticles = (articles || []).filter(art => {
    const name = art.designation || art.nom || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 stock-container" style={{ marginLeft: '260px', backgroundColor: '#0f111a', minHeight: '100vh', color: '#fff' }}>
      
      {/* 💡 Style dyal Print: Bach t-khrej l-warqa nqiya */}
      <style>
        {`
          @media print {
            .no-print, .sidebar, .navbar { display: none !important; }
            .stock-container { margin-left: 0 !important; padding: 0 !important; background-color: white !important; color: black !important; }
            .card { background-color: white !important; color: black !important; border: 1px solid #ddd !important; }
            table { color: black !important; }
            .badge { border: 1px solid #000 !important; color: black !important; }
            h2 { color: black !important; }
          }
        `}
      </style>

      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <h2 className="fw-bold text-white">État de Stock Actuel 📦</h2>
        <input 
          type="text" 
          className="form-control w-25 rounded-pill border-0 px-4" 
          placeholder="Rechercher un article..." 
          style={{ backgroundColor: '#1e2132', color: '#fff' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#1e2132' }}>
        <table className="table table-hover table-dark mb-0">
          <thead style={{ backgroundColor: '#2d334a' }}>
            <tr className="border-bottom border-secondary text-white">
              <th className="p-3">Désignation</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3 text-center">Quantité</th>
              <th className="p-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-5 text-white">Chargement en cours...</td></tr>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((art, index) => {
                const qte = parseInt(art.quantite || 0);
                return (
                  <tr key={index} className="border-bottom border-secondary text-white">
                    <td className="p-3 fw-bold">{art.designation || art.nom}</td>
                    <td className="p-3 text-muted">{art.categorie || 'General'}</td>
                    <td className={`p-3 text-center fw-bold ${qte <= 5 ? 'text-danger' : 'text-success'}`}>
                      {qte}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`badge rounded-pill ${qte === 0 ? 'bg-danger' : qte <= 5 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {qte === 0 ? 'Rupture' : qte <= 5 ? 'Faible' : 'En Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" className="text-center p-5 text-muted text-white">Aucun article trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 no-print text-end">
        <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold" onClick={() => window.print()}>
          🖨️ Imprimer l'inventaire (PDF)
        </button>
      </div>
    </div>
  );
};

export default Stock;