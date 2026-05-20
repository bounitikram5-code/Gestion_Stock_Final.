import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddArticle = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [clientArticles, setClientArticles] = useState([]);
    
    // Form states
    const [mode, setMode] = useState('new'); // 'new' ou 'update'
    const [selectedArticleId, setSelectedArticleId] = useState('');
    const [nom, setNom] = useState('');
    const [prix, setPrix] = useState('');
    const [quantite, setQuantite] = useState('');
    const [categorie, setCategorie] = useState('');
    const [images, setImages] = useState([]);

    // 1. Njibo ga3 les clients f l-bdia
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/clients').then(res => setClients(res.data));
    }, []);

    // 2. Mli i-t-khtar l-client, njibo les articles dialo
    useEffect(() => {
        if (selectedClient) {
            axios.get('http://127.0.0.1:8000/api/articles').then(res => {
                const filtered = res.data.filter(a => String(a.client_id) === String(selectedClient));
                setClientArticles(filtered);
            });
        }
    }, [selectedClient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prix', prix);
        formData.append('quantite', quantite);
        formData.append('client_id', selectedClient);
        formData.append('categorie', categorie || '');

        if (images && images.length > 0) {
            Array.from(images).forEach((file) => {
                formData.append('images[]', file); 
            });
        }

        try {
            if (mode === 'new') {
                await axios.post('http://127.0.0.1:8000/api/articles', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`http://127.0.0.1:8000/api/articles/${selectedArticleId}?_method=PUT`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            alert("Enregistré avec succès !");
            navigate('/articles'); 
        } catch (err) {
            console.error("Erreur detail:", err.response?.data);
            alert("Erreur: checki console dial browser");
        }
    };

    return (
        /* ✅ 7iyedna marginLeft: '260px' o derna w-100 bach t-ched blast-ha mzyan */
        <div className="p-4 w-100" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
            <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '900px' }}>
                <h3 className="fw-bold mb-4 text-primary">
                    <i className="bi bi-plus-circle me-2"></i> Ajouter / Gérer l'Article
                </h3>
                
                <form onSubmit={handleSubmit}>
                    {/* Choix du Client */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Choisir un Client</label>
                        <select className="form-select border-2" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
                            <option value="">Sélectionner...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>

                    {/* Radio Buttons Mode */}
                    {clientArticles.length > 0 && (
                        <div className="alert alert-light border border-info border-start-4 mb-4 shadow-sm">
                            <label className="d-block mb-2 text-dark fw-bold">
                                Ce client a déjà des articles. Que voulez-vous faire ?
                            </label>
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="mode" id="newMode" value="new" checked={mode === 'new'} onChange={() => setMode('new')} />
                                    <label className="form-check-label" htmlFor="newMode">Nouveau Article</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="mode" id="updateMode" value="update" checked={mode === 'update'} onChange={() => setMode('update')} />
                                    <label className="form-check-label" htmlFor="updateMode">Ajouter au stock existant</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Select Article existant */}
                    {mode === 'update' && (
                        <div className="mb-4 animate__animated animate__fadeIn">
                            <label className="form-label fw-bold text-info">Choisir l'article à modifier</label>
                            <select className="form-select border-info" value={selectedArticleId} onChange={(e) => setSelectedArticleId(e.target.value)} required>
                                <option value="">Sélectionner l'article...</option>
                                {clientArticles.map(a => <option key={a.id} value={a.id}>{a.nom} (Stock actuel: {a.quantite})</option>)}
                            </select>
                        </div>
                    )}

                    {/* Inputs standard */}
                    <div className="row g-3">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Nom de l'article</label>
                            <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex: T-shirt Cotton" />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Catégorie</label>
                            <input type="text" className="form-control" value={categorie} onChange={(e) => setCategorie(e.target.value)} placeholder="Ex: Vêtements" />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Prix (DH)</label>
                            <div className="input-group">
                                <input type="number" className="form-control" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                                <span className="input-group-text">DH</span>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Quantité</label>
                            <input type="number" className="form-control" value={quantite} onChange={(e) => setQuantite(e.target.value)} required />
                        </div>
                    </div>

                    {/* MULTIPLE IMAGES */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Images (Plusieurs choix possibles)</label>
                        <input type="file" className="form-control border-2 shadow-sm" multiple onChange={(e) => setImages(e.target.files)} />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-3 mt-2 rounded-3 shadow">
                        <i className="bi bi-check2-circle me-2"></i>
                        {mode === 'new' ? 'Enregistrer le Nouveau Produit' : 'Mettre à jour le Stock'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddArticle;