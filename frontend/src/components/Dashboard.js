import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
    const [stats, setStats] = useState({ 
        totalArticles: 0, 
        lowStock: [], 
        totalQuantity: 0,
        outOfStock: 0,
        allArticles: [] 
    });

    
    useEffect(() => {
        axios.get('http://localhost:8000/api/articles')
            .then(res => {
                const articles = res.data;
                const low = articles.filter(art => art.quantite > 0 && art.quantite < 5);
                const out = articles.filter(art => art.quantite <= 0);
                const totalQ = articles.reduce((acc, art) => acc + parseInt(art.quantite || 0), 0);
                
                setStats({
                    totalArticles: articles.length,
                    lowStock: low,
                    outOfStock: out.length,
                    totalQuantity: totalQ,
                    allArticles: articles
                });
            })
            .catch(err => console.error("Erreur API:", err));
    }, []);

    
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Rapport d'Alertes Stock - ISAG STOCK", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Genere le : ${new Date().toLocaleString()}`, 14, 30);

        const tableColumn = ["Article", "Quantite", "Statut"];
        const tableRows = [];

        
        const alerts = stats.lowStock.concat(stats.allArticles.filter(a => a.quantite <= 0));
        
        alerts.forEach(art => {
            tableRows.push([
                art.nom,
                art.quantite,
                art.quantite <= 0 ? 'Rupture' : 'Stock Bas'
            ]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [44, 78, 104] }
        });

        doc.save(`Rapport_Alertes_Ikram.pdf`);
    };

  
    const pieData = [
        { name: 'Normal', value: stats.totalArticles - stats.lowStock.length - stats.outOfStock },
        { name: 'Stock Bas', value: stats.lowStock.length },
        { name: 'Rupture', value: stats.outOfStock },
    ];
    const COLORS = ['#95d5ee', '#ffd1a9', '#f8a5a5'];

    const barData = stats.allArticles.slice(0, 5).map(art => ({
        name: art.nom,
        val: art.quantite
    }));

    return (
        <div style={{ backgroundColor: '#eef4f8', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold" style={{ color: '#2c4e68' }}>Inventory Management</h1>
                    <h4 style={{ color: '#5a8fb3' }}>Welcome Ikram ! 👋</h4>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <button onClick={exportToPDF} className="btn btn-danger shadow-sm rounded-pill px-4 fw-bold">
                        PDF 📄 Export Alerts
                    </button>
                    <input type="text" className="form-control rounded-pill border-0 shadow-sm" placeholder="Search..." style={{ width: '200px' }} />
                    <div className="bg-white p-2 rounded-circle shadow-sm">🔔</div>
                </div>
            </div>

            {/* Over View Cards */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Total Products', val: stats.totalArticles, icon: '📦', color: '#eef9fd' },
                    { label: 'Total Stock', val: stats.totalQuantity, icon: '📊', color: '#f2fdf7' },
                    { label: 'Low Stock', val: stats.lowStock.length, icon: '⚠️', color: '#fff9f0' },
                    { label: 'Out of Stock', val: stats.outOfStock, icon: '🚫', color: '#fff5f5' }
                ].map((item, index) => (
                    <div className="col-md-3" key={index}>
                        <div className="card border-0 shadow-sm p-3 rounded-4" style={{ backgroundColor: item.color }}>
                            <div className="d-flex align-items-center gap-3">
                                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                                <div>
                                    <p className="text-muted mb-0 fw-bold small">{item.label}</p>
                                    <h3 className="fw-bold mb-0" style={{ color: '#2c4e68' }}>{item.val}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="row g-4">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                        <h5 className="fw-bold mb-4" style={{ color: '#2c4e68' }}>Inventory Values</h5>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                        <h5 className="fw-bold mb-4" style={{ color: '#2c4e68' }}>Stock levels by article</h5>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="val" fill="#5a8fb3" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Table */}
            <div className="mt-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h5 className="fw-bold mb-3 text-danger">⚠️ Stock Alert List</h5>
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Article</th>
                                <th className="text-center">Quantite</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.lowStock.concat(stats.allArticles.filter(a => a.quantite <= 0)).map(art => (
                                <tr key={art.id}>
                                    <td className="fw-bold">{art.nom}</td>
                                    <td className="text-center text-danger fw-bold">{art.quantite}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${art.quantite <= 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                            {art.quantite <= 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;