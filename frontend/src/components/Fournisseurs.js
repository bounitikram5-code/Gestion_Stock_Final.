import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [formData, setFormData] = useState({ nom: '', telephone: '', email: '', ville: '' });
  const API_URL = 'http://localhost:8000/api/fournisseurs';

  const fetchFournisseurs = async () => {
    try {
      const res = await axios.get(API_URL);
      setFournisseurs(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFournisseurs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ nom: '', telephone: '', email: '', ville: '' });
      fetchFournisseurs();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-4" style={{ marginLeft: '260px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="mb-4 fw-bold">🚚 Gestion des Fournisseurs</h2>
      
      {/* 🟦 Stats Card (Kima f image ff7a68.png) */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 p-3 bg-primary text-white text-center">
            <h6 className="small fw-bold">TOTAL FOURNISSEURS</h6>
            <h1 className="fw-bold mb-0">{fournisseurs.length}</h1>
          </div>
        </div>
      </div>

      {/* ➕ Formulaire d'ajout (Hna fin kiy-tra l-ghalat) */}
      <div className="card shadow-sm p-4 border-0 rounded-4 bg-white mb-4">
        <h6 className="mb-3 fw-bold text-muted"><span className="text-primary">+</span> Ajouter un fournisseur</h6>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Nom du fournisseur" 
              value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Téléphone" 
              value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
          </div>
          <div className="col-md-3">
            <input type="email" className="form-control" placeholder="Email" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Ville" 
              value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} />
          </div>
          <div className="col-md-1">
            <button className="btn btn-success w-100 fw-bold">Ajouter</button>
          </div>
        </form>
      </div>

      {/* 📋 Table des Fournisseurs */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <table className="table mb-0 align-middle">
          <thead className="bg-dark text-white">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="py-3">Téléphone</th>
              <th className="py-3">Email</th>
              <th className="py-3">Ville</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map(f => (
              <tr key={f.id} className="border-top">
                <td className="px-4 fw-bold text-primary">{f.nom}</td>
                <td>{f.telephone}</td>
                <td>{f.email}</td>
                <td><span className="badge bg-light text-dark border">{f.ville}</span></td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-warning me-2">✏️</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={async () => { 
                    if(window.confirm("Supprimer?")){ await axios.delete(`${API_URL}/${f.id}`); fetchFournisseurs(); }
                  }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fournisseurs;