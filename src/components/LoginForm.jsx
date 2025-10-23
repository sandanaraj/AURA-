import React, {useState} from 'react'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:5000'

export default function LoginForm({onLogin}){
  // If onLogin prop isn't passed, fall back to window listener
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState(null)

  const submit = async ()=>{
    setError(null)
    try{
      const url = `${API_BASE}/api/${mode}`
      const res = await axios.post(url, {username, password})
      if(res.data.token){
        localStorage.setItem('aura_token', res.data.token)
        // emit event for App to pick up
        window.dispatchEvent(new CustomEvent('aura-login', {detail: {token: res.data.token}}))
      }else{
        setError(res.data.error || 'Unexpected response')
      }
    }catch(err){
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="auth">
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="auth-actions">
        <button onClick={submit}>{mode === 'login' ? 'Login' : 'Register'}</button>
        <button onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Switch to Register' : 'Switch to Login'}</button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
