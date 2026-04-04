import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0 p-md-3" 
         style={{ 
           background: '#f0f2f5',
           fontFamily: "'Segoe UI', Roboto, sans-serif" 
         }}>
      
      <div className="row bg-white shadow-lg w-100 mx-0 mx-md-2" 
           style={{ 
             maxWidth: '1000px', 
             borderRadius: '20px',
             overflow: 'hidden'
           }}>
        
        {/* --- Jiha d l-isra (Image): Responsive (H: 250px f télé / Full H f PC) --- */}
        <div className="col-md-6 d-flex flex-column justify-content-end p-4 p-md-5 text-white" 
             style={{ 
               backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url("/bg.jpg")`, 
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               minHeight: '250px' // Kat-khlli s-sora t-ban 7ta f télé
             }}>
          <div className="mb-2">
            <h1 className="fw-bold mb-0" style={{ letterSpacing: '-1px', fontSize: 'calc(1.5rem + 1.5vw)' }}>ISAG STOCK</h1>
            <p className="small opacity-75 mb-0">Gestion de Stock Pro v1.0</p>
          </div>
        </div>

        {/* --- Jiha d l-yemmen (Form): Minimalist b7al Niagahoster --- */}
        <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
          <div className="mb-4 text-start">
            <h5 className="fw-bold text-primary mb-2" style={{ fontSize: '1.1rem' }}>ISAG</h5>
            <h2 className="fw-bold text-dark" style={{ fontSize: '1.8rem' }}>
              {isRegister ? "Create Account" : "Login Member Area"}
            </h2>
          </div>

          <form onSubmit={handleLogin} className="w-100">
            {/* Email - Line Style */}
            <div className="mb-3 text-start">
              <label className="form-label small fw-bold text-dark mb-1">E-mail:</label>
              <input 
                type="email" 
                className="form-control custom-line-input" 
                placeholder="e.g. user@gmail.com" 
                required 
              />
            </div>

            {/* Password - Line Style */}
            <div className="mb-4 text-start">
              <label className="form-label small fw-bold text-dark mb-1">Password:</label>
              <input 
                type="password" 
                className="form-control custom-line-input" 
                placeholder="••••" 
                required 
              />
              {!isRegister && (
                <div className="text-end mt-2">
                  <button type="button" className="btn btn-link p-0 text-decoration-none small text-primary fw-medium" style={{ fontSize: '12px' }}>
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Login Button - Blue */}
            <div className="text-start mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2 fw-bold rounded-3 shadow-sm login-btn-blue w-100 w-md-auto">
                {isRegister ? "Sign Up" : "Login"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-start">
              <p className="small text-muted mb-0">
                {isRegister ? "Already have an account?" : "Don't have an Account?"}
                <button 
                  type="button" 
                  className="btn btn-link p-0 fw-bold text-primary ms-2 text-decoration-none small" 
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Log In" : "Sign Up"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .custom-line-input {
          border: none !important;
          border-bottom: 1px solid #dee2e6 !important;
          border-radius: 0 !important;
          padding: 10px 0 !important;
          background-color: transparent !important;
          transition: 0.3s;
        }
        .custom-line-input:focus {
          box-shadow: none !important;
          border-bottom: 2px solid #007bff !important;
        }
        .login-btn-blue {
          background: #007bff;
          border: none;
        }
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0 !important;
          }
          .row {
            border-radius: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;