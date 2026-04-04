import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mouvements = () => {
  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]); // 👥 Zidna hada
  const [fournisseurs, setFournisseurs] = useState([]); // 🚚 W hada
  
  const [formData, setFormData] = useState({
    article_id: '',
    type: 'Entrée',
    quantite: '',
    tiers: '', // 👈 Hada hwa l-client aw l-fournisseur
    date: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  // 1. Jbed ga3 l-data mn l-Backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/articles').then(res => setArticles(res.data)).catch(err => console.error(err));
    axios.get('http://localhost:8000/api/clients').then(res => setClients(res.data)).catch(err => console.error(err));
    axios.get('http://localhost:8000/api/fournisseurs').then(res => setFournisseurs(res.data)).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/mouvements', formData);
      setMessage("✅ " + res.data.message);
      setFormData({ ...formData, quantite: '', tiers: '' }); // Khwy l-champs
    } catch (err) {
     if (err.response && err.response.data.error) {
            alert(err.response.data.error); 
        } else {
            console.error(err);
        }
    }
  };

  return (
    <div className="p-4" style={{ marginLeft: '260px', backgroundColor: '#0f111a', minHeight: '100vh', color: '#fff' }}>
      <h2 className="fw-bold mb-4">Gestion des Mouvements 🔄</h2>

      <div className="card border-0 shadow-lg p-4 rounded-4" style={{ backgroundColor: '#1e2132', maxWidth: '600px' }}>
        {message && <div className="alert alert-info py-2">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Sélectionner l'Article */}
          <div className="mb-3">
            <label className="form-label text-muted">Sélectionner l'Article</label>
            <select className="form-select bg-dark text-white border-secondary" required
              onChange={(e) => setFormData({...formData, article_id: e.target.value})}>
              <option value="">-- Choisir un article --</option>
              {articles.map(art => <option key={art.id} value={art.id}>{art.nom}</option>)}
            </select>
          </div>

          {/* Type de Mouvement */}
          <div className="mb-3">
            <label className="form-label text-muted">Type de Mouvement</label>
            <select className="form-select bg-dark text-white border-secondary"
              onChange={(e) => setFormData({...formData,type: e.target.value, tiers: ''})}>
              <option value="Entrée">Entrée (Achat)</option>
              <option value="Sortie">Sortie (Vente)</option>
            </select>
          </div>

          {/* 💡 S-SIR: Hna n-xtārou Client aw Fournisseur 💡 */}
          <div className="mb-3">
            <label className="form-label text-muted">
              {formData.type === 'Entrée' ? 'Fournisseur (Men 3nd men chriti?)' : 'Client (L-men b3ti?)'}
            </label>
            <select 
              className="form-select bg-dark text-white border-secondary"
              required
              value={formData.tiers}
              onChange={(e) => setFormData({...formData, tiers: e.target.value})}
            >
              <option value="">-- Sélectionner --</option>
              {formData.type === 'Entrée' 
                ? fournisseurs.map(f => <option key={f.id} value={f.nom}>{f.nom}</option>)
                : clients.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)
              }
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Quantité</label>
            <input type="number" className="form-control bg-dark text-white border-secondary" required
              value={formData.quantite} onChange={(e) => setFormData({...formData, quantite: e.target.value})} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Date</label>
            <input type="date" className="form-control bg-dark text-white border-secondary" 
              value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
            Enregistrer le Mouvement
          </button>
        </form>
      </div>
    </div>
  );
};

export default Mouvements;