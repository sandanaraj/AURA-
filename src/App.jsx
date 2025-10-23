import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {Routes, Route, Link, Navigate, useNavigate, useLocation} from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('aura_token'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{ if(token) localStorage.setItem('aura_token', token); else localStorage.removeItem('aura_token') }, [token])
  

  const logout = ()=>{ setToken(null); navigate('/login') }

  const PrivateRoute = ({children}) => {
    return token ? children : <Navigate to="/login" replace />
  }

  return (
    <div className="container">
      <header className="top">
        <div className="brand">
          <Link to="/" className="logo" aria-label="AURA home">
            <span className="logo-mark" aria-hidden="true">💖</span>
            <span className="logo-text">AURA</span>
          </Link>
          <span className="tagline">Emotional Support</span>
        </div>
  <nav style={{display:'flex', alignItems:'center', gap:8}}>
          {token ? (
            <>
              <Link to="/profile" aria-label="Profile" title="Profile" className="profile-btn" style={{marginLeft:8}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
              <button aria-label="Logout" title="Logout" style={{marginLeft:8, borderRadius:6, padding:8, background:'#fff', border:'1px solid #e6e6e6'}} onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </>
          ) : (
            location.pathname !== '/login' && <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile token={token} />
            </PrivateRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Chat token={token} />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}
