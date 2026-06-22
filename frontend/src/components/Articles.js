import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleDetailsModal from './ArticleDetailsModal';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resArticles = await axios.get('http://127.0.0.1:8000/api/articles');
        const resClients = await axios.get('http://127.0.0.1:8000/api/clients');
        setArticles(resArticles.data);
        setClients(resClients.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
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

  const getClientName = (clientId) => {
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client ? client.nom : 'N/A';
  };

  const filteredArticles = articles
    .filter((art) =>
      selectedClient ? String(art.client_id) === String(selectedClient) : true
    )
    .filter((art) =>
      searchTerm
        ? art.nom?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  const totalArticles = articles.length;
  const totalClients = clients.length;
  const averagePrice =
    articles.length > 0
      ? (
          articles.reduce((sum, a) => sum + parseFloat(a.prix || 0), 0) /
          articles.length
        ).toFixed(2)
      : 0;

  return (
    <>
      <style>{`
        .inv-wrapper {
          background-color: #f8f9fa;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .inv-header {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
        }
        .inv-title {
          font-weight: 700;
          color: #212529;
          letter-spacing: -0.5px;
        }
        .inv-subtitle {
          color: #6c757d;
          font-size: 0.875rem;
        }
        .stat-card {
          background: #fff;
          border: 1px solid #eef0f3;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: all .25s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13,110,253,.08);
        }
        .stat-icon {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
          font-size: 1.25rem;
        }
        .stat-label {
          font-size: .75rem;
          text-transform: uppercase;
          letter-spacing: .5px;
          color: #6c757d;
          font-weight: 600;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #212529;
          margin: 0;
          line-height: 1.2;
        }
        .filter-panel {
          background: #fff;
          border: 1px solid #eef0f3;
          border-radius: 14px;
          padding: 1rem 1.25rem;
        }
        .filter-panel .form-control,
        .filter-panel .form-select {
          border: 1px solid #e4e7eb;
          background-color: #f8f9fa;
          font-size: .9rem;
          padding: .6rem .9rem;
          border-radius: 10px;
          transition: all .2s;
        }
        .filter-panel .form-control:focus,
        .filter-panel .form-select:focus {
          background-color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 .2rem rgba(13,110,253,.1);
        }
        .article-card {
          background: #fff;
          border: 1px solid #eef0f3;
          border-radius: 14px;
          overflow: hidden;
          transition: all .3s cubic-bezier(.4,0,.2,1);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(16,24,40,.1);
          border-color: #d6e4ff;
        }
        .article-img-wrap {
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
          aspect-ratio: 4/3;
        }
        .article-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
        .article-card:hover .article-img-wrap img {
          transform: scale(1.06);
        }
        .article-body {
          padding: 1rem 1.1rem 1.1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .article-name {
          font-weight: 600;
          color: #212529;
          font-size: 1rem;
          margin-bottom: .35rem;
          text-transform: capitalize;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-client-badge {
          display: inline-block;
          background: #eef4ff;
          color: #0d6efd;
          font-size: .7rem;
          font-weight: 600;
          padding: .25rem .6rem;
          border-radius: 6px;
          margin-bottom: .75rem;
          text-transform: uppercase;
          letter-spacing: .3px;
        }
        .article-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #198754;
          margin: 0;
        }
        .article-price small {
          font-size: .75rem;
          color: #6c757d;
          font-weight: 500;
          margin-left: 2px;
        }
        .article-actions {
          margin-top: .85rem;
          padding-top: .85rem;
          border-top: 1px solid #f1f3f5;
          display: flex;
          gap: .5rem;
        }
        .btn-action {
          flex: 1;
          font-size: .8rem;
          font-weight: 500;
          padding: .45rem .6rem;
          border-radius: 8px;
          border: 1px solid #e4e7eb;
          background: #fff;
          color: #495057;
          transition: all .2s;
        }
        .btn-action:hover {
          background: #f8f9fa;
          border-color: #0d6efd;
          color: #0d6efd;
        }
        .btn-action.primary {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
        .btn-action.primary:hover {
          background: #0b5ed7;
          color: #fff;
        }
        .btn-add {
          background: #0d6efd;
          border: none;
          color: #fff;
          font-weight: 500;
          padding: .6rem 1.25rem;
          border-radius: 10px;
          font-size: .9rem;
          transition: all .2s;
          box-shadow: 0 2px 6px rgba(13,110,253,.25);
        }
        .btn-add:hover {
          background: #0b5ed7;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13,110,253,.35);
        }
        .empty-state {
          background: #fff;
          border: 1px dashed #d6dade;
          border-radius: 14px;
          padding: 4rem 2rem;
          text-align: center;
        }
        .empty-state h5 {
          color: #212529;
          font-weight: 600;
        }
        .empty-state p {
          color: #6c757d;
          font-size: .9rem;
        }
        .spinner-wrap {
          padding: 5rem 0;
          text-align: center;
        }
      `}</style>

      <div className="inv-wrapper">
        {/* Header */}
        <div className="inv-header px-4 py-3">
          <div className="container-fluid">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h1 className="inv-title h3 mb-1">Inventory Management</h1>
                <p className="inv-subtitle mb-0">
                  Manage your product catalog and stock items
                </p>
              </div>
              <Link to="/articles/add" className="btn btn-add">
                + New Article
              </Link>
            </div>
          </div>
        </div>

        <div className="container-fluid px-4 py-4">
          
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="stat-card d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#eef4ff', color: '#0d6efd' }}>
                  <i className="bi bi-box-seam"></i>
                </div>
                <div>
                  <div className="stat-label">Total Articles</div>
                  <p className="stat-value">{totalArticles}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#e6f4ec', color: '#198754' }}>
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <div className="stat-label">Total Clients</div>
                  <p className="stat-value">{totalClients}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#fff4e5', color: '#fd7e14' }}>
                  <i className="bi bi-tag"></i>
                </div>
                <div>
                  <div className="stat-label">Average Price</div>
                  <p className="stat-value">
                    {averagePrice} <small style={{ fontSize: '0.9rem', color: '#6c757d' }}>DH</small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="filter-panel mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="stat-label d-block mb-2">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search articles by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="stat-label d-block mb-2">Filter by Client</label>
                <select
                  className="form-select"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">All Clients</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-action w-100"
                  onClick={() => {
                    setSelectedClient('');
                    setSearchTerm('');
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-semibold text-secondary">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
            </h6>
          </div>

          
          {loading ? (
            <div className="spinner-wrap">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="empty-state">
              <div className="mb-3" style={{ fontSize: '3rem', color: '#ced4da' }}>
                <i className="bi bi-inbox"></i>
              </div>
              <h5>No articles found</h5>
              <p className="mb-3">Try adjusting your filters or add a new article to get started.</p>
              <Link to="/articles/add" className="btn btn-add">
                + Add Article
              </Link>
            </div>
          ) : (
            <div className="row g-3">
              {filteredArticles.map((art) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={art.id}>
                  <div className="article-card" onClick={() => handleOpenModal(art)}>
                    <div className="article-img-wrap">
                      <img
                        src={getFirstImage(art.image)}
                        alt={art.nom}
                        onError={(e) => {
                          e.target.src = 'https://placehold.jp/300x200.png';
                        }}
                      />
                    </div>
                    <div className="article-body">
                      <span className="article-client-badge">
                        {getClientName(art.client_id)}
                      </span>
                      <h3 className="article-name">{art.nom}</h3>
                      <p className="article-price">
                        {art.prix} <small>DH</small>
                      </p>
                      <div className="article-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-action"
                          onClick={() => handleOpenModal(art)}
                        >
                          View
                        </button>
                        <button
                          className="btn-action primary"
                          onClick={() => handleEdit(art)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ArticleDetailsModal
          show={showModal}
          article={selectedArticle}
          handleClose={() => setShowModal(false)}
          onEdit={() => handleEdit(selectedArticle)}
        />
      </div>
    </>
  );
};

export default Articles;
