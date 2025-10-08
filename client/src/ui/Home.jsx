import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">• PROFESSIONAL CERTIFICATION PLATFORM</p>
          <h1 className="display">
            <span className="bold">Premium</span> <span className="accent">Certificate</span> <span className="bold">Generator</span>
          </h1>
          <p className="lede">
            Transform your educational programs with stunning, professionally designed certificates.
            Bulk generate verified credentials that showcase achievement and build trust.
          </p>

          <div className="features">
            <div className="fcard"><div className="icon">🔒</div><div>Secure & Verified</div></div>
            <div className="fcard"><div className="icon">⚡</div><div>Bulk Generation</div></div>
            <div className="fcard"><div className="icon">✨</div><div>Premium Design</div></div>
          </div>

          <Link to="/generate" className="btn cta">🚀 Start Creating Certificates</Link>
        </div>

        <div className="hero-card">
          <div className="dots">
            <span></span><span className="active"></span><span></span>
          </div>
          <div className="trophy">🏆</div>
          <h3>Certificate of Excellence</h3>
          <p>Awarded to outstanding graduates</p>
          <div className="legend"><span className="a"></span><span className="b"></span><span className="c"></span></div>
        </div>
      </div>
    </section>
  )
}
