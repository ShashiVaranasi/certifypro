import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Shell(){
  const { pathname } = useLocation()
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <img src="/brand-logo.png" />
          <span>CertifyPro</span>
        </div>
        <div className="spacer" />
        <nav>
          <Link to="/" className={pathname==='/'?'active':''}>Home</Link>
          <Link to="/generate" className={pathname.startsWith('/generate')?'active':''}>Generate</Link>
          <Link to="/certificates" className={pathname.startsWith('/certificates')?'active':''}>Certificates</Link>
          <Link to="/login" className="btn small">Admin Login</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="foot">© {new Date().getFullYear()} CertifyPro</footer>
    </div>
  )
}
