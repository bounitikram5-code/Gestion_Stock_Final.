import React from 'react';

const ArticleDetailsModal = ({ show, article, handleClose, onEdit }) => {
    if (!show || !article) return null;

    // Logic bach n-parsing t-swar (JSON oula Array)
    const getImages = () => {
        const imageData = article.image || [];
        try {
            return Array.isArray(imageData) 
                ? imageData 
                : (typeof imageData === 'string' ? JSON.parse(imageData || '[]') : [imageData]);
        } catch (e) {
            return [imageData];
        }
    };

    const allImages = getImages();

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
                    
                    <div className="modal-header border-0 p-4 pb-0">
                        <h4 className="fw-bold text-primary m-0">Détails de l'Article</h4>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        <div className="row">
                            {/* SECTION IMAGES */}
                            <div className="col-md-6 mb-3">
                                {allImages.length > 0 ? (
                                    <div id="carouselDetails" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {allImages.map((path, index) => (
                                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                    <img 
                                                        src={`http://127.0.0.1:8000/storage/${path.replace(/\\/g, '/')}`} 
                                                        className="d-block w-100" 
                                                        alt={`Article ${index}`}
                                                        style={{ height: '350px', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x350?text=Image+Introuvable'; }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {allImages.length > 1 && (
                                            <>
                                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselDetails" data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target="#carouselDetails" data-bs-slide="next">
                                                    <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center border" style={{ height: '350px' }}>
                                        <p className="text-muted">Aucune image disponible</p>
                                    </div>
                                )}
                            </div>

                            {/* SECTION INFOS */}
                            <div className="col-md-6">
                                <h3 className="fw-bold text-dark mb-1 text-capitalize">{article.nom}</h3>
                                <p className="text-muted mb-3">Réf: {article.id}</p>
                                
                                <div className="p-3 bg-light rounded-4 border-0">
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Prix :</span>
                                        <span className="fw-bold text-dark fs-5">{article.prix} DH</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Stock :</span>
                                        <span className={`fw-bold ${article.quantite < 10 ? 'text-danger' : 'text-success'}`}>
                                            {article.quantite} Unités
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2">
                                        <span className="text-muted">Propriétaire :</span>
                                        <span className="fw-bold text-primary">{article.client?.nom || 'Client Inconnu'}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 d-grid">
                                    <button onClick={onEdit} className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm">
                                        Modifier l'Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-0 p-4 pt-0">
                        <button className="btn btn-outline-secondary rounded-pill px-5" onClick={handleClose}>Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailsModal;