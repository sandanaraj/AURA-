import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'https://nm2599bc-5000.inc1.devtunnels.ms/'

import { t } from '../i18n'

export default function Login({onLogin}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const submit = async ()=>{
    setError(null)
    try{
      const url = `${API_BASE}/api/${mode}`
      const res = await axios.post(url, {username, password})
      if(res.data.token){
        onLogin(res.data.token)
        // redirect to chat after successful login/register
        navigate('/')
      }else{
        setError(res.data.error || 'Unexpected response')
      }
    }catch(err){
      setError(err.response?.data?.error || err.message)
    }
  }
  return (
    <div className="auth-page">
  <h2 className="auth-title">{mode === 'login' ? t('en','login') : t('en','register')}</h2>
      <form className="auth-form" onSubmit={(e)=>{ e.preventDefault(); submit(); }}>

  <label className="sr-only">{t('en','username')}</label>
  <input className="auth-input" placeholder={t('en','username')} value={username} onChange={e=>setUsername(e.target.value)} />

  <label className="sr-only">{t('en','password')}</label>
  <input className="auth-input" placeholder={t('en','password')} type="password" value={password} onChange={e=>setPassword(e.target.value)} />

        <div className="auth-actions">
          <button type="submit" className="btn-primary">{mode === 'login' ? t('en','login') : t('en','register')}</button>
          <button type="button" className="btn-ghost" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? t('en','create_account') : t('en','have_account')}</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
