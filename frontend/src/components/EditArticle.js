import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [nom, setNom] = useState('');
    const [articleData, setArticleData] = useState(null);
    const [variantes, setVariantes] = useState([]);
    const taillesDisponibles = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/articles/${id}`)
            .then(res => {
                setNom(res.data.nom);
                setArticleData(res.data);
                
                let data = res.data.variantes;
                if (data) {
                    // Force parsing ila kān string, o t-aked blli stocks dima objet
                    let parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    const sanitized = parsedData.map(v => ({
                        ...v,
                        stocks: v.stocks || {} 
                    }));
                    setVariantes(sanitized);
                } else {
                    setVariantes([]);
                }
            })
            .catch(err => console.error("Error fetching article:", err));
    }, [id]);

    const ajouterCouleur = () => {
        setVariantes([...variantes, { couleur: '', image: null, preview: '', stocks: {} }]);
    };

    const handleImageChange = (index, file) => {
        if (!file) return;
        const newVariantes = [...variantes];
        newVariantes[index].image = file;
        newVariantes[index].preview = URL.createObjectURL(file);
        setVariantes(newVariantes);
    };

    const toggleTaille = (idxVar, taille) => {
        const newVariantes = [...variantes];
        // Signture dyal safety bach may-t-be9ch l-code
        if (!newVariantes[idxVar].stocks) newVariantes[idxVar].stocks = {};

        if (newVariantes[idxVar].stocks[taille] !== undefined) {
            delete newVariantes[idxVar].stocks[taille];
        } else {
            newVariantes[idxVar].stocks[taille] = 0;
        }
        setVariantes([...newVariantes]);
    };

    const handleSave = async () => {
        if (!articleData) return;

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prix', articleData.prix);
        formData.append('client_id', articleData.client_id);
        formData.append('_method', 'PUT'); 

        const variantesData = variantes.map((v, index) => {
            // Ila kkant t-swira jdiida (File), n-siftoha b-smiya khassa
            if (v.image instanceof File) {
                formData.append(`image_variante_${index}`, v.image);
            }
            return {
                couleur: v.couleur,
                stocks: v.stocks,
                image_url: v.image_url || null 
            };
        });
        
        formData.append('variantes', JSON.stringify(variantesData));

        try {
            await axios.post(`http://127.0.0.1:8000/api/articles/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("L'article a été modifié avec succès ! ✨");
            navigate('/articles');
        } catch (err) {
            console.error("Erreur detail:", err.response?.data);
            alert("Erreur lors de la modification");
        }
    };

    if (!articleData) return <div className="p-5 text-center text-muted">Chargement en cours...</div>;

    return (
        <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                <h2 className="fw-bold mb-4">Modifier : {nom}</h2>

                {variantes.map((v, idx) => (
                    <div key={idx} className="p-4 mb-4 bg-white border rounded-4 shadow-sm position-relative">
                        <button 
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-3 rounded-circle"
                            onClick={() => setVariantes(variantes.filter((_, i) => i !== idx))}
                        >✕</button>

                        <div className="row">
                            <div className="col-md-3 text-center border-end">
                                <label className="fw-bold small text-muted d-block mb-2">IMAGE COULEUR :</label>
                                <div 
                                    className="rounded-4 border d-flex align-items-center justify-content-center overflow-hidden mb-2" 
                                    style={{ height: '120px', backgroundColor: '#fdfdfd', cursor: 'pointer' }}
                                    onClick={() => document.getElementById(`file-${idx}`).click()}
                                >
                                    {v.preview || v.image_url ? (
                                        <img 
                                            src={v.preview || `http://127.0.0.1:8000/storage/${v.image_url}`} 
                                            alt="preview" className="w-100 h-100" style={{ objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <span className="text-muted small">+ Photo</span>
                                    )}
                                </div>
                                <input type="file" id={`file-${idx}`} className="d-none" onChange={(e) => handleImageChange(idx, e.target.files[0])} />
                            </div>

                            <div className="col-md-9 ps-4">
                                <div className="mb-3">
                                    <label className="fw-bold small text-muted text-uppercase">Nom du couleur :</label>
                                    <input 
                                        type="text" className="form-control border-0 bg-light rounded-pill mt-1"
                                        value={v.couleur}
                                        onChange={(e) => {
                                            const nv = [...variantes];
                                            nv[idx].couleur = e.target.value;
                                            setVariantes(nv);
                                        }}
                                    />
                                </div>

                                <label className="fw-bold small text-muted d-block mb-2 text-uppercase">Tailles & Stocks :</label>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {taillesDisponibles.map(t => {
                                        const isActive = v.stocks && v.stocks[t] !== undefined;
                                        return (
                                            <button 
                                                key={t}
                                                className={`btn btn-sm rounded-3 fw-bold ${isActive ? 'btn-primary' : 'btn-outline-light text-dark'}`}
                                                onClick={() => toggleTaille(idx, t)}
                                                style={{ width: '55px', border: '1px solid #eee' }}
                                            >
                                                {t} {isActive && '✕'}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="d-flex flex-wrap gap-3 mt-3">
                                    {v.stocks && Object.keys(v.stocks).map(t => (
                                        <div key={t} className="bg-light p-2 rounded-3 text-center shadow-sm border" style={{ minWidth: '70px' }}>
                                            <span className="d-block fw-bold small text-primary">{t}</span>
                                            <input 
                                                type="number" className="form-control form-control-sm border-0 bg-transparent text-center fw-bold"
                                                value={v.stocks[t]}
                                                onChange={(e) => {
                                                    const nv = [...variantes];
                                                    nv[idx].stocks[t] = e.target.value;
                                                    setVariantes(nv);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="btn btn-outline-primary w-100 py-3 rounded-4 mb-4" style={{ borderStyle: 'dashed' }} onClick={ajouterCouleur}>
                    + Ajouter une nouvelle couleur
                </button>

                <div className="d-flex gap-3">
                    <button className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm" onClick={handleSave}>Enregistrer les modifications</button>
                    <button className="btn btn-light rounded-pill px-4" onClick={() => navigate('/articles')}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default EditArticle;