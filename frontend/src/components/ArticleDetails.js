import React from 'react';

const ArticleDetails = ({ article, onClose }) => {
    console.log("Data dyal l-article f details:", article); // <--- Zidi had l-line
    
    if (!article) return null;
    // ... rest of code
    // --- FIX DIAL T-SWAR ---
    const imageData = article.image || article.images || [];
    
    const allImages = Array.isArray(imageData) 
        ? imageData 
        : (typeof imageData === 'string' ? JSON.parse(imageData || '[]') : [imageData]);

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
                    
                    <div className="modal-header border-0 p-4 pb-0">
                        <h4 className="fw-bold text-primary m-0">Détails de l'Article</h4>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        <div className="row">
                            {/* SECTION IMAGES */}
                            <div className="col-md-6 mb-3">
                                {allImages.length > 0 ? (
                                    <div id="carouselExample" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {allImages.map((path, index) => (
                                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                    <img 
                                                        src={`http://127.0.0.1:8000/storage/${path.replace(/\\/g, '/')}`} 
                                                        className="d-block w-100" 
                                                        alt={`Image ${index}`}
                                                        style={{ height: '300px', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Introuvable'; }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {allImages.length > 1 && (
                                            <>
                                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-2"></span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                                    <span className="carousel-control-next-icon bg-dark rounded-circle p-2"></span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center border" style={{ height: '300px' }}>
                                        <div className="text-center text-muted">
                                            <i className="bi bi-image fs-1 d-block mb-2"></i>
                                            Aucune image disponible
                                        </div>
                                    </div>
                                )}

                                {/* --- JDID: SECTION VARIANTES (T-sawer s-sghar) --- */}
                                <div className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
                                    {article.variantes && (
                                        (typeof article.variantes === 'string' 
                                            ? JSON.parse(article.variantes) 
                                            : article.variantes
                                        ).map((v, index) => (
                                            <div key={index} className="text-center border rounded p-1 shadow-sm bg-white" style={{ width: '70px' }}>
                                                <img 
                                                    src={`http://127.0.0.1:8000/storage/${v.image_url}`} 
                                                    alt={v.couleur}
                                                    className="rounded"
                                                    style={{ width: '100%', height: '50px', objectFit: 'cover' }}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/70'} 
                                                />
                                                <div style={{ fontSize: '9px', fontWeight: 'bold' }} className="mt-1 text-truncate">
                                                    {v.couleur}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* SECTION INFOS */}
                            <div className="col-md-6">
                                <h3 className="fw-bold text-dark mb-1 text-capitalize">{article.nom}</h3>
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
                                    {article.categorie || 'Sans Catégorie'}
                                </span>
                                
                                <div className="p-3 bg-light rounded-4 border-0">
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Prix :</span>
                                        <span className="fw-bold text-dark fs-5">{article.prix} DH</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Stock Total :</span>
                                        <span className={`fw-bold ${article.quantite < 10 ? 'text-danger' : 'text-success'}`}>
                                            {article.quantite} Unités
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2">
                                        <span className="text-muted">Propriétaire :</span>
                                        <span className="fw-bold text-primary">{article.client?.nom || 'ggg'}</span>
                                    </div>
                                </div>

                                {/* Affichage simple des stocks par taille si dispo */}
                                <div className="mt-3">
                                    <h6 className="fw-bold small text-muted text-uppercase">Disponibilité par Taille :</h6>
                                    <div className="d-flex gap-2 mt-2">
                                        {article.variantes && JSON.parse(typeof article.variantes === 'string' ? article.variantes : JSON.stringify(article.variantes)).map((v) => 
                                            v.stocks && Object.entries(v.stocks).map(([size, qty]) => (
                                                <span key={size} className="badge border text-dark fw-normal">
                                                    {size}: <b className="text-primary">{qty}</b>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-4 d-grid">
                                    <button className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm">
                                        Modifier l'Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-0 p-4 pt-0">
                        <button className="btn btn-outline-secondary rounded-pill px-5" onClick={onClose}>Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetails;