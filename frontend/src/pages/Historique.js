// frontend/src/pages/Historique.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Historique = () => {
  // 1. استعملنا سمية واحدة 'mouvements' باش تطابق مع الـ map لتحت
  const [mouvements, setMouvements] = useState([]);

  useEffect(() => {
    // 2. تأكدي من الـ URL واش هو /api/mouvements أو /api/mouvements/historique
    axios.get('http://localhost:8000/api/mouvements') 
      .then(res => setMouvements(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4" style={{ backgroundColor: '#0f111a', minHeight: '100vh', color: '#fff' }}>
      <h2 className="fw-bold mb-4">Historique des Mouvements 📜</h2>
      
      <div className="card border-0 shadow-lg p-4 rounded-4" style={{ backgroundColor: '#1e2132' }}>
        <table className="table table-dark table-hover mt-3">
          <thead>
            <tr>
              <th>Article</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Tiers (Client/Fournisseur)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* دابا 'mouvements' ولات هي اللي جاية من الـ useState الفوق */}
            {mouvements.map((mouv) => (
              <tr key={mouv.id}>
                <td>{mouv.article ? mouv.article.nom : '---'}</td>
                
                <td>
                  <span className={`badge ${mouv.type.includes('Entrée') ? 'bg-success' : 'bg-danger'}`}>
                    {mouv.type.includes('Entrée') ? 'Entrée' : 'Sortie'}
                  </span>
                </td>
                
                <td>{mouv.quantite}</td>
                
                <td>{mouv.tiers || '---'}</td>
                
                <td>{mouv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historique;