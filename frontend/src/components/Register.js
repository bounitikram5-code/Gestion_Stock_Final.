import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Hna katsifti l-data l-backend (POST /api/register)
    alert("Compte créé avec succès!");
    navigate('/login'); // Melli i-tsajjel i-mchi l-login
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
        <h3 className="fw-bold text-center mb-4">Créer un compte</h3>
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small fw-bold">Prénom</label>
              <input type="text" className="form-control" required onChange={(e)=>setFormData({...formData, prenom: e.target.value})}/>
            </div>
            <div className="col-md-6 mb-3">
              <label className="small fw-bold">Nom</label>
              <input type="text" className="form-control" required onChange={(e)=>setFormData({...formData, nom: e.target.value})}/>
            </div>
          </div>
          <div className="mb-3">
            <label className="small fw-bold">Email</label>
            <input type="email" className="form-control" required onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
          </div>
          <div className="mb-4">
            <label className="small fw-bold">Mot de passe</label>
            <input type="password" className="form-control" required onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
          </div>
          <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">S'inscrire</button>
          <div className="text-center mt-3 small">
            Déjà inscrit? <Link to="/login" className="fw-bold text-decoration-none">Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;