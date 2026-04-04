import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ nom: '', telephone: '', email: '', ville: '' });
  const API_URL = 'http://localhost:8000/api/clients';

  const fetchClients = async () => {
    try {
      const res = await axios.get(API_URL);
      setClients(res.data);
    } catch (err) { console.error("Erreur fetching clients:", err); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ nom: '', telephone: '', email: '', ville: '' });
      fetchClients();
    } catch (err) { console.error("Erreur adding client:", err); }
  };

  return (
    <div className="p-4" style={{ marginLeft: '260px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="mb-4 fw-bold">👥 Gestion des Clients</h2>
      
      {/* Formulaire d'ajout */}
      <div className="card shadow-sm p-4 border-0 rounded-4 bg-white mb-4">
        <h5 className="mb-3 fw-bold text-muted">➕ Ajouter un nouveau client</h5>
        <form onSubmit={handleSubmit} className="row g-3 p-3 bg-light rounded-3 border">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Nom Complet" 
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
            <button className="btn btn-primary w-100 fw-bold">OK</button>
          </div>
        </form>
      </div>

      {/* Liste des clients */}
      <div className="card shadow-sm border-0 rounded-4 bg-white overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td className="fw-bold text-primary">{c.nom}</td>
                <td>{c.telephone}</td>
                <td>{c.email}</td>
                <td><span className="badge bg-secondary">{c.ville}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-danger border-2" 
                    onClick={async () => { if(window.confirm("Supprimer?")){ await axios.delete(`${API_URL}/${c.id}`); fetchClients(); }}}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;