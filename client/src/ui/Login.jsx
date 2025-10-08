import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('admin@certifypro.io')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    try{
      const res = await fetch('/api/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      if(!res.ok) throw new Error('Invalid credentials')
      await res.json()
      navigate('/generate')
    }catch(err){ setError(err.message) }
  }

  return (
    <section className="login-hero">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="muted">Demo credentials are pre-filled below.</p>
        <form onSubmit={submit} className="form">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn">Sign in</button>
        </form>
      </div>
    </section>
  )
}
