import React, { useState } from 'react';

const ArticleDetailsModal = ({ show, article, handleClose, onEdit }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!show || !article) return null;

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
  const buildSrc = (path) =>
    `http://127.0.0.1:8000/storage/${String(path).replace(/\\/g, '/')}`;
  const fallback = 'https://via.placeholder.com/600x500?text=Image+Introuvable';

  const qty = Number(article.quantite ?? 0);
  let stockLabel = 'En stock';
  let stockClass = 'adm-badge-success';
  let stockDot = '#16a34a';
  if (qty < 5) {
    stockLabel = 'Stock critique';
    stockClass = 'adm-badge-danger';
    stockDot = '#dc2626';
  } else if (qty <= 10) {
    stockLabel = 'Stock faible';
    stockClass = 'adm-badge-warning';
    stockDot = '#f59e0b';
  }

  const stockPct = Math.max(4, Math.min(100, (qty / 50) * 100));

  return (
    <>
      <style>{`
        .adm-overlay {
          position: fixed; inset: 0; z-index: 1050;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: admFade .25s ease;
          overflow-y: auto;
        }
        @keyframes admFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes admPop { from { opacity: 0; transform: translateY(12px) scale(.98) } to { opacity: 1; transform: none } }

        .adm-modal {
          width: 100%; max-width: 1100px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 24px 60px -20px rgba(15,23,42,.35),
            0 8px 20px -8px rgba(15,23,42,.15);
          overflow: hidden;
          animation: admPop .3s cubic-bezier(.16,1,.3,1);
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
          color: #0f172a;
          max-height: calc(100vh - 2rem);
          display: flex; flex-direction: column;
        }

        .adm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid #eef2f7;
          background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
        }
        .adm-eyebrow {
          font-size: .7rem; font-weight: 600; letter-spacing: .12em;
          text-transform: uppercase; color: #64748b;
        }
        .adm-title { font-size: 1.05rem; font-weight: 700; margin: 2px 0 0; color: #0f172a; }
        .adm-close {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid #e5e7eb; background: #fff; color: #475569;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .15s ease;
        }
        .adm-close:hover { background: #f1f5f9; color: #0f172a; }

        .adm-body { padding: 1.75rem; overflow-y: auto; }

        .adm-gallery-main {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
          border: 1px solid #eef2f7;
          aspect-ratio: 4/3;
          display: flex; align-items: center; justify-content: center;
        }
        .adm-gallery-main img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .adm-gallery-main:hover img { transform: scale(1.06); }
        .adm-gallery-empty { color: #94a3b8; font-size: .9rem; }

        .adm-ref-chip {
          position: absolute; top: 14px; left: 14px;
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(8px);
          padding: 6px 12px; border-radius: 999px;
          font-size: .7rem; font-weight: 600; color: #0f172a;
          letter-spacing: .04em;
          box-shadow: 0 2px 8px rgba(15,23,42,.08);
        }

        .adm-thumbs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px; margin-top: 14px;
        }
        .adm-thumb {
          aspect-ratio: 1;
          border-radius: 10px; overflow: hidden;
          border: 2px solid transparent;
          background: #f1f5f9;
          cursor: pointer; padding: 0;
          transition: all .15s ease;
        }
        .adm-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .adm-thumb:hover { transform: translateY(-2px); }
        .adm-thumb.is-active { border-color: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,.25); }

        .adm-product-name {
          font-size: 1.75rem; font-weight: 700; line-height: 1.2;
          color: #0f172a; margin: 0 0 8px; text-transform: capitalize;
        }
        .adm-ref-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f1f5f9; color: #475569;
          padding: 4px 10px; border-radius: 6px;
          font-size: .72rem; font-weight: 600; letter-spacing: .04em;
        }

        .adm-price-card {
          margin-top: 18px;
          border-radius: 14px;
          padding: 18px 20px;
          background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
          border: 1px solid #dbeafe;
          display: flex; align-items: center; justify-content: space-between;
        }
        .adm-price-label { font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: #1d4ed8; }
        .adm-price-value { font-size: 2rem; font-weight: 800; color: #0f172a; line-height: 1; margin-top: 4px; }
        .adm-price-unit { font-size: .85rem; font-weight: 600; color: #475569; margin-left: 4px; }

        .adm-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px;
          font-size: .75rem; font-weight: 600;
        }
        .adm-badge-success { background: #dcfce7; color: #166534; }
        .adm-badge-warning { background: #fef3c7; color: #92400e; }
        .adm-badge-danger  { background: #fee2e2; color: #991b1b; }
        .adm-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        .adm-info-grid {
          margin-top: 18px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .adm-info-card {
          background: #fff;
          border: 1px solid #eef2f7;
          border-radius: 12px;
          padding: 12px 14px;
          transition: all .15s ease;
        }
        .adm-info-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(15,23,42,.05); }
        .adm-info-label { font-size: .68rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #64748b; }
        .adm-info-value { font-size: .95rem; font-weight: 700; color: #0f172a; margin-top: 4px; word-break: break-word; }

        .adm-stats {
          margin-top: 18px;
          padding: 16px;
          border-radius: 14px;
          background: #fafbfc;
          border: 1px solid #eef2f7;
        }
        .adm-stats-title {
          font-size: .7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: .1em; color: #64748b; margin-bottom: 10px;
        }
        .adm-stat-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0;
        }
        .adm-stat-row + .adm-stat-row { border-top: 1px dashed #e5e7eb; }
        .adm-stat-key { font-size: .82rem; color: #475569; font-weight: 500; }
        .adm-stat-val { font-size: .85rem; color: #0f172a; font-weight: 600; }
        .adm-bar { height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-top: 6px; width: 120px; }
        .adm-bar-fill { height: 100%; border-radius: 999px; transition: width .4s ease; }

        .adm-footer {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding: 1rem 1.75rem;
          border-top: 1px solid #eef2f7;
          background: #fafbfc;
        }
        .adm-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px; font-weight: 600; font-size: .9rem;
          cursor: pointer; transition: all .2s ease; border: 1px solid transparent;
        }
        .adm-btn-secondary {
          background: #fff; color: #334155; border-color: #e2e8f0;
        }
        .adm-btn-secondary:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .adm-btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: #fff;
          box-shadow: 0 6px 16px -4px rgba(37,99,235,.45);
        }
        .adm-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 22px -6px rgba(37,99,235,.55); }
        .adm-btn-primary:active { transform: translateY(0); }

        @media (max-width: 768px) {
          .adm-body { padding: 1.25rem; }
          .adm-product-name { font-size: 1.4rem; }
          .adm-price-value { font-size: 1.6rem; }
          .adm-info-grid { grid-template-columns: 1fr; }
          .adm-footer { flex-direction: column-reverse; }
          .adm-footer .adm-btn { width: 100%; }
          .adm-header { padding: 1rem 1.25rem; }
        }
      `}</style>

      <div className="adm-overlay" onClick={handleClose}>
        <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="adm-header">
            <div>
              <div className="adm-eyebrow">Inventory · Product Details</div>
              <div className="adm-title">Détails de l'Article</div>
            </div>
            <button className="adm-close" onClick={handleClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="adm-body">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="adm-gallery-main">
                  <span className="adm-ref-chip">SKU · #{article.id}</span>
                  {allImages.length > 0 ? (
                    <img
                      src={buildSrc(allImages[activeIdx])}
                      alt={article.nom}
                      onError={(e) => { e.target.src = fallback; }}
                    />
                  ) : (
                    <span className="adm-gallery-empty">Aucune image disponible</span>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="adm-thumbs">
                    {allImages.slice(0, 5).map((path, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`adm-thumb ${i === activeIdx ? 'is-active' : ''}`}
                        onClick={() => setActiveIdx(i)}
                      >
                        <img
                          src={buildSrc(path)}
                          alt={`thumb-${i}`}
                          onError={(e) => { e.target.src = fallback; }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="adm-ref-badge">REF · {article.id}</span>
                  <span className={`adm-badge ${stockClass}`}>
                    <span className="adm-dot" style={{ background: stockDot }} />
                    {stockLabel}
                  </span>
                </div>

                <h2 className="adm-product-name">{article.nom}</h2>

                <div className="adm-price-card">
                  <div>
                    <div className="adm-price-label">Prix unitaire</div>
                    <div className="adm-price-value">
                      {article.prix}<span className="adm-price-unit">DH</span>
                    </div>
                  </div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>

                <div className="adm-info-grid">
                  <div className="adm-info-card">
                    <div className="adm-info-label">Quantité en stock</div>
                    <div className="adm-info-value">{qty} Unités</div>
                  </div>
                  <div className="adm-info-card">
                    <div className="adm-info-label">Client / Propriétaire</div>
                    <div className="adm-info-value">{article.client?.nom || 'Inconnu'}</div>
                  </div>
                  <div className="adm-info-card">
                    <div className="adm-info-label">Référence</div>
                    <div className="adm-info-value">#{article.id}</div>
                  </div>
                  <div className="adm-info-card">
                    <div className="adm-info-label">Statut produit</div>
                    <div className="adm-info-value">{qty > 0 ? 'Actif' : 'Indisponible'}</div>
                  </div>
                </div>

                <div className="adm-stats">
                  <div className="adm-stats-title">Statistiques d'inventaire</div>
                  <div className="adm-stat-row">
                    <span className="adm-stat-key">Disponibilité</span>
                    <span className="adm-stat-val">{qty > 0 ? 'En vente' : 'Rupture'}</span>
                  </div>
                  <div className="adm-stat-row">
                    <span className="adm-stat-key">Niveau d'inventaire</span>
                    <div>
                      <div className="adm-bar">
                        <div className="adm-bar-fill" style={{ width: `${stockPct}%`, background: stockDot }} />
                      </div>
                    </div>
                  </div>
                  <div className="adm-stat-row">
                    <span className="adm-stat-key">Code produit</span>
                    <span className="adm-stat-val">SKU-{String(article.id).padStart(5, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="adm-footer">
            <button className="adm-btn adm-btn-secondary" onClick={handleClose}>
              Fermer
            </button>
            <button className="adm-btn adm-btn-primary" onClick={onEdit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Modifier l'Article
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailsModal;
