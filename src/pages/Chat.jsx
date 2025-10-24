import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://nm2599bc-5000.inc1.devtunnels.ms';

export default function Chat({ token }) {
  const [messages, setMessages] = useState([
    { from: 'aura', text: `Hi, I'm Aura — your emotional support friend 💖` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // language auto-detection is handled server-side now
  const audioRef = useRef(null)
  const listRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-clear server-side history on mount when logged in
  useEffect(() => {
    if (!token) return;
    const doClear = async () => {
      try {
        await axios.post(
          `${API_BASE}/api/clear_history`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages([
          { from: 'aura', text: `Hi, I'm Aura — your emotional support friend 💖` }
        ]);
      } catch (e) {
        console.warn('Failed to clear history', e?.response?.data || e.message);
      }
    };
    doClear();
  }, [token]);

  // audioRef is used to autoplay supportive song if backend requests it

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    if (loading) return;
    setLoading(true);
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');

    try {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(`${API_BASE}/api/chat`, { message: text }, { headers });

      const body = res.data || {};
      const displayReply = body.reply || 'No reply';
      setMessages(prev => [...prev, { from: 'aura', text: displayReply, meta: body.mode }]);

      // play supportive song if backend requested it
      if (body.play_song && body.song_url) {
        try {
          const rawUrl = body.song_url
          console.log('backend song_url:', rawUrl)
          // if backend returned a relative path (starts with '/'), prefix API_BASE
          const resolved = rawUrl.startsWith('http') ? rawUrl : `${API_BASE}${rawUrl}`
          if (audioRef.current) {
            audioRef.current.src = resolved
            audioRef.current.play().catch(e => console.warn('Audio play prevented', e))
          }
        } catch (e) {
          console.warn('Failed to play song', e)
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'aura', text: 'Error: ' + (err.response?.data?.error || err.message) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* server auto-detects language; no UI control */}
        <audio ref={audioRef} hidden />

        {/* Chat Messages */}
        <div className="chat" ref={listRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`msg ${m.from}`}>
              <div className="msg-row" style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 8 }}>
                {m.from === 'aura' && <div className="avatar" style={{ marginRight: 8 }}>A</div>}
                <div className="bubble">
                  {m.text}
                  <div className="meta">{m.time || new Date().toLocaleTimeString()}</div>
                </div>
                {m.from === 'user' && <div className="avatar" style={{ marginLeft: 8 }}>U</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="composer">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Message Aura — press Enter to send, Shift+Enter for newline"
          />
          <button onClick={send} disabled={loading} className={`icon-btn primary ${loading ? 'btn-loading' : ''}`} title="Send message" aria-label="Send message">
            {loading ? (<><span className="spinner"/></>) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
