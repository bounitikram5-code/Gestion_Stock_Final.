import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Articles', path: '/articles', icon: '🏷️' },
    { name: 'Clients', path: '/clients', icon: '👥' },
    { name: 'Gestion Clients', path: '/clients/gestion', icon: '⚙️' }, // Zidna hada bach t-ajouter
    { name: 'Fournisseurs', path: '/fournisseurs', icon: '🚚' },
    { name: 'Mouvements', path: '/mouvements', icon: '🔄' },
    { name: 'Stock', path: '/stock', icon: '📦' },
    { name: 'Historique', path: '/historique', icon: '📜' },
  ];

  return (
    <div className="vh-100 d-flex flex-column shadow-sm" 
         style={{ 
           width: '260px', 
           backgroundColor: '#2c3e50', 
           color: '#fff',
           flexShrink: 0, 
           zIndex: 1000 
         }}>
      
      <div className="p-4 mb-2">
        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
          <span style={{ color: '#3498db' }}>ISAG</span>
          <span className="text-white">STOCK</span>
        </h4>
      </div>

      <div className="flex-grow-1 px-3 overflow-y-auto">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="nav-item mb-1">
                <Link 
                  to={item.path} 
                  className={`nav-link d-flex align-items-center rounded-3 p-3 transition-all ${isActive ? 'active-link' : 'text-light-gray hover-link'}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="me-3 fs-5">{item.icon}</span>
                  <span className="fw-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-3 mt-auto border-top border-secondary border-opacity-25">
        {showProfileMenu && (
          <div className="bg-white rounded-3 shadow-lg p-2 mb-2" 
               style={{ position: 'absolute', bottom: '85px', left: '15px', right: '15px', zIndex: 100 }}>
            <button onClick={() => navigate('/login')} className="btn btn-outline-danger w-100 mb-1 border-0 d-flex align-items-center gap-2 py-2">
              🚪 Déconnecter
            </button>
            <button onClick={() => setShowProfileMenu(false)} className="btn btn-light w-100 border-0 d-flex align-items-center gap-2 py-2">
              ✖️ Annuler
            </button>
          </div>
        )}

        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="btn w-100 d-flex align-items-center p-2 rounded-3 border-0 profile-btn" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' }}>
          <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: '40px', height: '40px' }}>
            <span className="fw-bold small text-white">IK</span>
          </div>
          <div className="text-start overflow-hidden">
            <p className="m-0 small fw-bold text-white">Ikram</p>
            <p className="m-0 text-muted" style={{ fontSize: '11px' }}>Administrateur</p>
          </div>
        </button>
      </div>

      <style>{`
        .text-light-gray { color: #bdc3c7; }
        .hover-link:hover { background-color: rgba(255, 255, 255, 0.1); color: #fff !important; }
        .active-link { background-color: #3498db !important; color: #fff !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default Sidebar;
