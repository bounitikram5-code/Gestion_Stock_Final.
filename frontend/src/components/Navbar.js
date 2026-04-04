import React from 'react';

const Navbar = ({ setAuth }) => (
  <nav className="navbar navbar-light bg-white px-4 no-print border-bottom" style={{ marginLeft: '260px', height: '70px' }}>
    <div className="container-fluid">
      <h5 className="fw-bold text-primary mb-0">Gestion de Stock Pro</h5>
      <button onClick={() => setAuth(false)} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold">Déconnexion</button>
    </div>
  </nav>
);

export default Navbar;