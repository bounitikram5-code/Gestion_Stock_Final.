import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
// Components
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Articles from './components/Articles';
import AddArticle from './components/AddArticle';
import EditArticle from './components/EditArticle';
import Clients from './components/Clients';
import AddClient from './components/AddClient';
import EditClient from './components/EditClient';
import ClientDetails from './components/ClientDetails';
import GestionClients from './components/GestionClients';
import Fournisseurs from './components/Fournisseurs';
import Mouvements from './pages/Mouvements';
import Stock from './pages/Stock';
import DetailClient from './pages/DetailClient';
import Historique from './pages/Historique';
import GestionAdmins from './pages/GestionAdmins';
import MonStock from './pages/MonStock';
import AccueilClient from './pages/AccueilClient';
import Chatbot from './components/Chatbot';

const Layout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const noSidebarRoutes = ['/login', '/', '/register', '/mon-stock', '/accueil-client'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname) 
                      && user.role !== 'client';

  // Machi katban f login u register
  const showChatbot = !['/login', '/', '/register'].includes(location.pathname);

  return (
    <div className="d-flex min-vh-100 bg-light w-100 m-0 p-0">
      {showSidebar && <Sidebar />}
      <div className="flex-grow-1 w-100 overflow-hidden d-flex flex-column">
        {children}
      </div>
      {showChatbot && <Chatbot />} {/* ← hna */}
    </div>
  );
};
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/add" element={<AddArticle />} />
          <Route path="/articles/edit/:id" element={<EditArticle />} />

          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/clients/gestion" element={<GestionClients />} />

          <Route path="/fournisseurs" element={<Fournisseurs />} />
          <Route path="/mouvements" element={<Mouvements />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/client/:id" element={<DetailClient />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/gestion-admins" element={<GestionAdmins />} />
          <Route path="/mon-stock" element={<MonStock />} />

<Route path="/accueil-client" element={<AccueilClient />} />

        </Routes>
      </Layout>
    </Router>
  );
};

export default App;