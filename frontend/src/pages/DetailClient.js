import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DetailClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // تأكد أن الـ API كيرجع بيانات مهيكلة
    axios.get(`http://127.0.0.1:8000/api/stock-par-client`)
      .then(res => {
        const found = res.data.find(c => c.id === parseInt(id));
        setClient(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center p-5">Chargement...</div>;
  if (!client) return <div className="text-center p-5 text-danger">Client introuvable</div>;

  const filtered = (client.articles || []).filter(a => 
    a.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <button className="btn btn-sm btn-light border mb-3" onClick={() => navigate(-1)}>Retour</button>
      
      <div className="card p-4 shadow-sm border-0 rounded-4">
        <h3>{client.nom}</h3>
        <input 
          className="form-control my-3" 
          placeholder="Rechercher..." 
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <table className="table">
          <thead><tr><th>Article</th><th>Stock</th></tr></thead>
          <tbody>
            {filtered.map(art => (
              <tr key={art.id}>
                <td>{art.nom}</td>
                <td>{art.quantite} Unités</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailClient;