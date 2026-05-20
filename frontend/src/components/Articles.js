import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleDetailsModal from './ArticleDetailsModal';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resArticles = await axios.get('http://127.0.0.1:8000/api/articles');
        const resClients = await axios.get('http://127.0.0.1:8000/api/clients');
        setArticles(resArticles.data);
        setClients(resClients.data);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (art) => {
    setSelectedArticle(art);
    setShowModal(true);
  };

  const handleEdit = (art) => {
    setShowModal(false);
    navigate(`/articles/edit/${art.id}`);
  };

  const filteredArticles = selectedClient && selectedClient !== "" 
    ? articles.filter(art => String(art.client_id) === String(selectedClient)) 
    : articles;

  // Fonction bach t-récupérer ghir awwal t-swira
  const getFirstImage = (imageData) => {
    if (!imageData) return 'https://placehold.jp/300x200.png';
    try {
      const images = Array.isArray(imageData) ? imageData : JSON.parse(imageData);
      return images.length > 0 
        ? `http://127.0.0.1:8000/storage/${images[0].replace(/\\/g, '/')}` 
        : 'https://placehold.jp/300x200.png';
    } catch (e) {
      return `http://127.0.0.1:8000/storage/${imageData.replace(/\\/g, '/')}`;
    }
  };

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
        <h2 className="fw-bold m-0">📦 Catalogue des Articles</h2>
        <Link to="/articles/add" className="btn btn-primary px-4 rounded-pill">
          + Ajouter un Article
        </Link>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4" style={{ maxWidth: '350px' }}>
        <label className="form-label fw-bold small text-muted">FILTRER PAR CLIENT :</label>
        <select 
          className="form-select border-0 bg-light" 
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Tous les Articles</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        {filteredArticles.map(art => (
          <div className="col-md-4 col-xl-3" key={art.id}>
            <div 
              className="card h-100 border-0 shadow-sm overflow-hidden" 
              style={{ borderRadius: '15px', cursor: 'pointer' }}
              onClick={() => handleOpenModal(art)}
            >
              <img 
                src={getFirstImage(art.image)} 
                className="card-img-top" 
                style={{ height: '220px', objectFit: 'cover' }}
                alt={art.nom} 
                onError={(e) => { e.target.src = 'https://placehold.jp/300x200.png'; }}
              />
              <div className="card-body">
                <h5 className="fw-bold text-capitalize">{art.nom}</h5>
                <p className="text-primary fw-bold">{art.prix} DH</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ArticleDetailsModal 
        show={showModal} 
        article={selectedArticle} 
        handleClose={() => setShowModal(false)} 
        onEdit={() => handleEdit(selectedArticle)} 
      />
    </div>
  );
};

export default Articles;