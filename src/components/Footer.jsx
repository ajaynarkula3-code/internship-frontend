import React from 'react';
import { Briefcase, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '2.5rem 1.5rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <div className="logo-badge" style={{ width: 28, height: 28 }}>
              <Briefcase size={16} />
            </div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Smart Internship Eligibility & Recommendation System</strong>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Empowering students with automated eligibility validation and intelligent matching algorithms.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#2563eb" />
            <span>Rule-Based Eligibility Engine</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="#7c3aed" />
            <span>Weighted Recommendation Scoring</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Spring Boot + React + MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
