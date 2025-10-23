import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'https://nm2599bc-5000.inc1.devtunnels.ms'

export default function Profile({token}){
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetch = async ()=>{
    try{
      const res = await axios.get(`${API_BASE}/api/guardians`, {headers: {Authorization: `Bearer ${token}`}})
      setList(res.data)
    }catch(err){ setError(err.response?.data?.error || err.message) }
  }

  useEffect(()=>{ if(token) fetch() }, [token])

  const add = async ()=>{
    try{
      const res = await axios.post(`${API_BASE}/api/guardians`, {name, email}, {headers: {Authorization: `Bearer ${token}`}})
      setList(prev => [...prev, res.data])
      setName(''); setEmail('')
    }catch(err){ setError(err.response?.data?.error || err.message) }
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
        <h4>Guardians</h4>
        <div className="guardian-list">
          {list.map(g=> <div key={g.id} className="guardian-item">{g.name} — {g.email}</div>)}
        </div>
        <div className="guardian-add">
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button onClick={add}>Add Guardian</button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>
    </div>
  )
}
