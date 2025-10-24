import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IconButton from '../components/IconButton'

const API_BASE = 'https://nm2599bc-5000.inc1.devtunnels.ms'

export default function Profile({token}){
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const [showAdd, setShowAdd] = useState(false)
  const cacheKey = token ? `guardians_cache_${token}` : null

  const loadCache = ()=>{
    if(!cacheKey) return null
    try{
      const raw = localStorage.getItem(cacheKey)
      if(!raw) return null
      return JSON.parse(raw)
    }catch(e){ console.warn('Failed to read guardians cache', e); return null }
  }

  const writeCache = (arr)=>{
    if(!cacheKey) return
    try{ localStorage.setItem(cacheKey, JSON.stringify(arr)) }catch(e){ console.warn('Failed to write guardians cache', e) }
  }

  const fetch = async (opts = {force:false})=>{
    // if not forcing, read cache first and avoid network call
    if(!opts.force){
      const cached = loadCache()
      if(cached && Array.isArray(cached) && cached.length){
        setList(cached)
        return
      }
    }
    try{
      const res = await axios.get(`${API_BASE}/api/guardians`, {headers: {Authorization: `Bearer ${token}`}})
      setList(res.data)
      writeCache(res.data)
    }catch(err){ setError(err.response?.data?.error || err.message) }
  }

  // load from cache on mount; only fetch if no cache
  useEffect(()=>{ if(token) fetch({force:false}) }, [token])

  const add = async ()=>{
    try{
      setBusy(true)
      const res = await axios.post(`${API_BASE}/api/guardians`, {name, email}, {headers: {Authorization: `Bearer ${token}`}})
      // backend returns created guardian
      const updated = [...list, res.data]
      setList(updated)
      writeCache(updated)
      setName(''); setEmail('')
      // hide the add form after successful add
      setShowAdd(false)
    }catch(err){ setError(err.response?.data?.error || err.message) }
    finally{ setBusy(false) }
  }

  const startEdit = (g)=>{
    setEditingId(g.id)
    setEditName(g.name)
    setEditEmail(g.email)
  }

  const cancelEdit = ()=>{
    setEditingId(null)
    setEditName('')
    setEditEmail('')
  }

  const saveEdit = async (id)=>{
    try{
      setBusy(true)
      const res = await axios.put(`${API_BASE}/api/guardians/${id}`, {name: editName, email: editEmail}, {headers: {Authorization: `Bearer ${token}`}})
      const updated = list.map(p => p.id === id ? res.data : p)
      setList(updated)
      writeCache(updated)
      cancelEdit()
    }catch(err){ setError(err.response?.data?.error || err.message) }
    finally{ setBusy(false) }
  }

  const deleteGuardian = async (id)=>{
    if(!window.confirm('Delete this guardian?')) return
    try{
      setBusy(true)
      await axios.delete(`${API_BASE}/api/guardians/${id}`, {headers: {Authorization: `Bearer ${token}`}})
      const updated = list.filter(p => p.id !== id)
      setList(updated)
      writeCache(updated)
    }catch(err){ setError(err.response?.data?.error || err.message) }
    finally{ setBusy(false) }
  }

  const forceRefresh = async ()=>{
    setError(null)
    await fetch({force:true})
  }

  return (
    <div className="profile-page">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
        <button className="back-btn" aria-label="Back to chat" onClick={()=>navigate('/')}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3 style={{margin:0}}>Profile</h3>
        <div style={{width:36}} />
      </div>
      <section>
        <h4 style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span>Guardians</span>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button onClick={forceRefresh} style={{background:'transparent', border:'none', color:'#4f46e5', cursor:'pointer'}}>Refresh</button>
          </div>
        </h4>
        <div className="guardian-table-wrap">
          <table className="guardian-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{width:160}}>Added</th>
                <th style={{width:140, textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(g=> (
                <tr key={g.id}>
                  <td>
                    {editingId === g.id ? (
                      <input value={editName} onChange={e=>setEditName(e.target.value)} />
                    ) : (
                      <strong>{g.name}</strong>
                    )}
                  </td>
                  <td>
                    {editingId === g.id ? (
                      <input value={editEmail} onChange={e=>setEditEmail(e.target.value)} />
                    ) : (
                      <div style={{color:'#374151'}}>{g.email}</div>
                    )}
                  </td>
                  <td className="guardian-added">{g.added_at ? new Date(g.added_at).toLocaleString() : '-'}</td>
                  <td>
                    <div className="guardian-actions">
                      {editingId === g.id ? (
                        <>
                          <IconButton title="Save" color="#059669" onClick={()=>saveEdit(g.id)}>
                            <svg viewBox="0 0 24 24" strokeWidth="2" stroke="#059669" fill="none"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </IconButton>
                          <IconButton title="Cancel" color="#6b7280" onClick={cancelEdit}>
                            <svg viewBox="0 0 24 24" strokeWidth="2" stroke="#6b7280" fill="none"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton title="Edit" color="#f59e0b" onClick={()=>startEdit(g)}>
                            <svg viewBox="0 0 24 24" strokeWidth="2" stroke="#f59e0b" fill="none"><path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </IconButton>
                          <IconButton title="Delete" color="#ef4444" onClick={()=>deleteGuardian(g.id)}>
                            <svg viewBox="0 0 24 24" strokeWidth="2" stroke="#ef4444" fill="none"><polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </IconButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="guardian-add">
          {showAdd ? (
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <button onClick={add} disabled={busy} className={busy? 'btn-loading' : ''}>{busy? 'Adding...' : 'Add'}</button>
              <button onClick={()=>{ setShowAdd(false); setName(''); setEmail('') }} style={{background:'transparent', border:'none', color:'#6b7280', cursor:'pointer'}}>Cancel</button>
            </div>
          ) : (
            <div>
              <button onClick={()=>setShowAdd(true)} style={{background:'transparent', border:'1px dashed #d1d5db', padding:'6px 10px', borderRadius:6, cursor:'pointer',color:'black'}}>+ Add Guardian</button>
            </div>
          )}
        </div>
        {error && <div className="error">{error}</div>}
      </section>
    </div>
  )
}