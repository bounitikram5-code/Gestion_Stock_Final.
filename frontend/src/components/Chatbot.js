import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [context, setContext]   = useState(null);
  const messagesEndRef          = useRef(null);
  const inputRef                = useRef(null);

  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.role === 'manager';

  
  useEffect(() => {
    if (open && !context) fetchContext();
    if (open && messages.length === 0) {
      const welcome = isAdmin
        ? `Bonjour ${user.name} ! Je suis votre assistant ISAG STOCK. Posez-moi vos questions sur les stocks, les clients, les mouvements ou les alertes.`
        : `Bonjour ${user.name} ! Je suis votre assistant personnel. Posez-moi vos questions sur votre stock et vos articles.`;
      setMessages([{ role: 'assistant', content: welcome }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContext = async () => {
    const token = localStorage.getItem('token');
    const h = { Authorization: `Bearer ${token}` };
    try {
      if (isAdmin) {
        const [ra, rc, rm, rl] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/articles',      { headers: h }),
          axios.get('http://127.0.0.1:8000/api/clients',       { headers: h }),
          axios.get('http://127.0.0.1:8000/api/mouvements',    { headers: h }),
          axios.get('http://127.0.0.1:8000/api/activity-logs', { headers: h }).catch(() => ({ data: [] })),
        ]);
        setContext({ role: 'admin', articles: ra.data, clients: rc.data, mouvements: rm.data, logs: rl.data });
      } else {
        const res = await axios.get('http://127.0.0.1:8000/api/mon-stock', { headers: h });
        setContext({ role: 'client', client: res.data, articles: res.data.articles || [], mouvements: res.data.mouvements || [] });
      }
    } catch (e) { console.error(e); }
  };

  const buildSystemPrompt = () => {
    if (!context) return 'Tu es un assistant de gestion de stock. Réponds en français.';

    if (context.role === 'admin') {
      const low    = context.articles.filter(a => a.quantite > 0 && a.quantite < 5);
      const out    = context.articles.filter(a => a.quantite <= 0);
      const totalQ = context.articles.reduce((s, a) => s + parseInt(a.quantite || 0), 0);
      const recentLogs = (context.logs || []).slice(0, 15);

      return `Tu es l'assistant IA du système ISAG STOCK. Tu aides l'administrateur ${user.name}.

DONNÉES ACTUELLES:
- Articles: ${context.articles.length} (total: ${totalQ} unités)
- Stock bas (<5): ${low.map(a => `${a.nom}(${a.quantite})`).join(', ') || 'aucun'}
- Rupture stock: ${out.map(a => a.nom).join(', ') || 'aucun'}
- Clients: ${context.clients.length}
- Mouvements: ${context.mouvements.length}

ARTICLES:
${context.articles.map(a => `- ${a.nom}: ${a.quantite} unités, ${a.prix} DH, client: ${a.client?.nom || '—'}`).join('\n')}

CLIENTS:
${context.clients.map(c => `- ${c.nom} (${c.ville || '—'})`).join('\n')}

DERNIÈRES ACTIONS:
${recentLogs.map(l => `- ${l.user_name}: ${l.action} — ${l.description}`).join('\n')}

Réponds en français, de manière concise et professionnelle.`;

    } else {
      const totalQ = context.articles.reduce((s, a) => s + (a.pivot?.quantite ?? a.quantite ?? 0), 0);
      const low    = context.articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) < 5 && (a.pivot?.quantite ?? a.quantite ?? 0) > 0);
      const out    = context.articles.filter(a => (a.pivot?.quantite ?? a.quantite ?? 0) === 0);

      return `Tu es l'assistant IA personnel du client ${user.name} sur ISAG STOCK.

DONNÉES:
- Articles: ${context.articles.length}, Quantité totale: ${totalQ} unités
- Stock bas: ${low.map(a => `${a.nom}(${a.pivot?.quantite ?? a.quantite})`).join(', ') || 'aucun'}
- Épuisés: ${out.map(a => a.nom).join(', ') || 'aucun'}

ARTICLES:
${context.articles.map(a => {
  const qty = a.pivot?.quantite ?? a.quantite ?? 0;
  return `- ${a.nom}: ${qty} unités${a.categorie ? `, catégorie: ${a.categorie}` : ''}`;
}).join('\n') || '- Aucun article'}

RÈGLES: Ne jamais mentionner d'autres clients. Réponds uniquement sur le stock de ${user.name}. Réponds en français.`;
    }
  };

  const sendMessage = async (msgText) => {
    const text = msgText || input.trim();
    if (!text || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt();
      const token = localStorage.getItem('token');

      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          system:   systemPrompt,
          messages: newMessages.map(m => ({
            role:    m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      const data  = await res.json();
      const reply = data.reply || "Désolé, je n'ai pas pu répondre.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur s'est produite." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const suggestions = isAdmin
    ? ['Articles en rupture?', "Qui s'est connecté?", 'Combien de clients?', 'Total du stock?']
    : ["Combien d'articles j'ai?", 'Stock bas?', 'Quantité totale?', 'Articles épuisés?'];

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#0f1f42', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)', transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#1a3a6e'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#0f1f42'; }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <div style={{ position: 'absolute', top: 3, right: 3, width: 11, height: 11, borderRadius: '50%', background: '#4ade80', border: '2px solid #fff' }} />
        </button>
      )}

      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 'clamp(320px, 90vw, 390px)',
          height: 'clamp(480px, 80vh, 560px)',
          background: '#fff', borderRadius: 20,
          border: '1px solid #E4EAF6',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'chatUp .25s ease',
        }}>
          <style>{`
            @keyframes chatUp { from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none} }
            @keyframes bounce { 0%,80%,100%{transform:scale(.7);opacity:.5}40%{transform:scale(1);opacity:1} }
            .chat-sugg:hover{background:#EEF3FF!important;border-color:#2563EB!important;color:#1D4ED8!important}
            .chat-input:focus{outline:none;border-color:#2563EB!important}
          `}</style>

         
          <div style={{ background: '#0f1f42', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#4ade80', border: '1.5px solid #0f1f42' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Assistant ISAG</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                  {isAdmin ? 'Accès admin complet' : `Espace de ${user.name}`}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >✕</button>
          </div>

        
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length <= 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestions.map(s => (
                  <button key={s} className="chat-sugg" onClick={() => sendMessage(s)}
                    style={{ padding: '5px 11px', borderRadius: 20, border: '1px solid #E4EAF6', background: '#fff', color: '#64748B', fontSize: 11.5, cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3, paddingLeft: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Assistant</div>
                )}
                <div style={{
                  padding: '10px 13px', maxWidth: '84%', fontSize: 13.5, lineHeight: 1.55,
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? '#0f1f42' : '#F0F4FF',
                  color: msg.role === 'user' ? '#fff' : '#0F172A',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3, paddingLeft: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Assistant</div>
                <div style={{ padding: '12px 16px', background: '#F0F4FF', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94A3B8', animation: `bounce .8s ${i*.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '10px 12px', borderTop: '1px solid #E4EAF6', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
            <textarea ref={inputRef} className="chat-input"
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Posez votre question..." rows={1}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: '1.5px solid #E4EAF6', background: '#F7F9FF', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', resize: 'none', maxHeight: 90, overflowY: 'auto', lineHeight: 1.5, transition: 'border-color .15s' }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0, background: !input.trim() || loading ? '#E4EAF6' : '#0f1f42', color: !input.trim() || loading ? '#94A3B8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', transition: 'all .15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
