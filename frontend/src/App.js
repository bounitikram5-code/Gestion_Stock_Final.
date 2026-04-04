import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Articles from './components/Articles';
import Clients from './components/Clients'; // <--- 1. Check had l-import
import Fournisseurs from './components/Fournisseurs'; // <--- 2. Check had l-import
import Register from './components/Register'; // <--- 2. Check had l-import
import Mouvements from './pages/Mouvements';
import Stock from './pages/Stock';
import Historique from './pages/Historique';
// --- 💡 Layout Component ---
const Layout = ({ children }) => {
  const location = useLocation();
  // Mat-biyyench l-sidebar ghir f l-login
  const showSidebar = location.pathname !== '/login' && location.pathname !== '/'; 

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

// --- 💡 App Component ---
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* L-page l-oula t-koun hiya l-Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/register" element={<Register />} />
<Route path="/mouvements" element={<Mouvements />} />
          
          {/* 3. Darouri t-zidi had l-joūj bach l-pages may-bkauch khawin */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/fournisseurs" element={<Fournisseurs />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/historique" element={<Historique />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;