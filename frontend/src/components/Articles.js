import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ designation: '', categorie: '', prix_achat: '', quantite: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const API_URL = 'http://127.0.0.1:8000/api/articles';

  const card3DStyle = `
    .article-card {
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      perspective: 1500px;
      overflow: visible !important;
      position: relative;
      z-index: 1;
    }
    .article-card:hover {
      transform: translateY(-15px) rotateX(8deg) !important;
      box-shadow: 0 30px 60px rgba(0,0,0,0.15) !important;
      z-index: 10;
    }
    /* Had l-partie hya li ghadi tkhlli les boutons ikhdmi */
    .article-card .card-body {
      position: relative;
      z-index: 100 !important; /* Ghadi ntl3o l-body l-fo9 */
    }
    .article-card .btn {
      position: relative;
      z-index: 1000 !important; /* Les boutons khasshom ikouno fo9 kolchi */
      pointer-events: auto !important;
    }
    .img-container {
      height: 220px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #fcfcfc;
      border-radius: 15px 15px 0 0;
    }
    .article-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: all 0.5s ease-in-out !important;
      padding: 10px;
    }
    .article-card:hover img {
      transform: scale(1.3) translateZ(80px) translateY(-15px) !important;
      filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));
    }
    .article-card:hover .img-container {
      overflow: visible !important;
    }
  `;

  const fetchArticles = async () => {
    try {
      const res = await axios.get(API_URL);
      setArticles(res.data);
    } catch (err) { console.error("Erreur fetch:", err); }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleEdit = (art) => {
    setIsEditing(true);
    setCurrentId(art.id);
    setFormData({ designation: art.nom, categorie: art.categorie, prix_achat: art.prix, quantite: art.quantite });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nom', formData.designation); 
    data.append('categorie', formData.categorie);
    data.append('prix', formData.prix_achat); 
    data.append('quantite', formData.quantite);
    if (imageFile) data.append('image_url', imageFile);

    try {
      if (isEditing) {
        await axios.post(`${API_URL}/${currentId}?_method=PUT`, data);
        setIsEditing(false);
        alert("Modifié avec succès!");
      } else {
        await axios.post(API_URL, data);
        alert("Ajouté avec succès!");
      }
      setFormData({ designation: '', categorie: '', prix_achat: '', quantite: 0 });
      setImageFile(null);
      setCurrentId(null);
      fetchArticles();
    } catch (err) { alert("Erreur!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bghiti t-m-sa7 had l-article?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchArticles();
      } catch (err) { console.error("Erreur delete:", err); }
    }
  };

  return (
    <div className="p-4" style={{ marginLeft: '260px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <style>{card3DStyle}</style>
      <h2 className="mb-4 fw-bold">🏷️ Catalogue des Articles</h2>
      
      {/* Formulaire */}
      <div className="card shadow-sm p-4 border-0 rounded-4 bg-white mb-5 no-print">
        <h5 className="mb-3 fw-bold text-muted">{isEditing ? "✏️ Modifier" : "➕ Nouvel Article"}</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3"><input type="text" className="form-control" placeholder="Désignation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required /></div>
          <div className="col-md-2">
            <select className="form-select" value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})}>
              <option value="">Catégorie</option>
              <option value="Électronique">Électronique</option>
              <option value="Informatique">Informatique</option>
              <option value="Bureautique">Bureautique</option>
            </select>
          </div>
          <div className="col-md-2"><input type="number" step="0.01" className="form-control" placeholder="Prix" value={formData.prix_achat} onChange={(e) => setFormData({...formData, prix_achat: e.target.value})} required /></div>
          <div className="col-md-1"><input type="number" className="form-control" placeholder="Qté" value={formData.quantite} onChange={(e) => setFormData({...formData, quantite: e.target.value})} required /></div>
          <div className="col-md-3"><input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></div>
          <div className="col-md-1"><button type="submit" className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'} w-100 fw-bold`}>OK</button></div>
        </form>
      </div>

      <div className="row">
        {articles.length > 0 ? articles.map(art => (
          <div className="col-md-4 col-lg-3 mb-5" key={art.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 article-card">
              <div className="img-container">
                {art.image_url ? 
                    <img src={`http://127.0.0.1:8000/storage/${art.image_url}`} alt={art.nom} /> 
                    : <span className="display-1 opacity-25">📦</span>
                }
              </div>
              <div className="card-body">
                <span className="badge mb-2 bg-primary-subtle text-primary">{art.categorie}</span>
                <h6 className="fw-bold mb-1">{art.nom}</h6>
                <p className="text-muted small mb-2">Réf: ART-{art.id} | <span className={`fw-bold ${art.quantite < 5 ? 'text-danger' : 'text-success'}`}>Stock: {art.quantite}</span></p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fw-bold text-dark">{art.prix} DH</span>
                  <div className="d-flex" style={{ position: 'relative', zIndex: 1100 }}>
                    <button 
                      className="btn btn-sm btn-outline-primary border-0 me-1" 
                      onClick={(e) => { e.stopPropagation(); handleEdit(art); }}
                      type="button"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      onClick={(e) => { e.stopPropagation(); handleDelete(art.id); }}
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : <div className="text-center p-5 w-100"><h5 className="text-muted">Aucun article trouvé.</h5></div>}
      </div>
    </div>
  );
};

export default Articles;