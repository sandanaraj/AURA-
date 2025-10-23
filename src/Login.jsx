import React from 'react'
import LoginForm from './components/LoginForm'

export default function Login(){
  return (
    <div className="login-page">
      <h2>Welcome to AURA</h2>
      <p>Please login or register to continue.</p>
      <LoginForm />
    </div>
  )
}
