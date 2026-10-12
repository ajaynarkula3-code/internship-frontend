import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Briefcase, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Compass, 
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  const domains = [
    { title: 'Software Development', icon: Layers, count: 'High Demand', color: '#2563eb' },
    { title: 'Java Development', icon: Cpu, count: 'Top Opportunities', color: '#7c3aed' },
    { title: 'Web Development', icon: Compass, count: 'Remote & Hybrid', color: '#059669' },
    { title: 'Data Analytics', icon: TrendingUp, count: 'Fast Growing', color: '#d97706' },
    { title: 'AI / Machine Learning', icon: Sparkles, count: 'Leading Research', color: '#dc2626' },
    { title: 'Cloud Computing & DevOps', icon: Sliders, count: 'Enterprise Roles', color: '#0284c7' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ffffff 100%)',
        padding: '5rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'white',
            border: '1px solid var(--purple-border)',
            borderRadius: 'var(--radius-full)',
            padding: '0.4rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--purple)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} />
            <span>AI-Inspired Transparent Rule-Based Engine</span>
          </div>

          <h1 style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            color: 'var(--text-main)'
          }}>
            Smart Internship <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Eligibility & Recommendation
            </span> System
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: 750,
            margin: '0 auto 2.5rem'
          }}>
            Stop guessing whether you qualify. Our automatic engine computes your academic criteria,
            CGPA thresholds, degree requirements, and skills to recommend the highest-probability internships.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/internships" className="btn btn-primary btn-lg">
              <Search size={18} />
              Explore All Internships
            </Link>

            {isAuthenticated ? (
              user?.role === 'STUDENT' ? (
                <Link to="/student/recommendations" className="btn btn-purple btn-lg">
                  <Sparkles size={18} />
                  My Top Recommendations
                </Link>
              ) : (
                <Link to={`/${user?.role.toLowerCase()}/dashboard`} className="btn btn-purple btn-lg">
                  Go to {user?.role} Dashboard
                </Link>
              )
            ) : (
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In to Match Profile
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Core System Architecture
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Transparent mathematical matching algorithms tailored for college internships
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Pillar 1 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Automatic Eligibility Engine
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Evaluates hard academic constraints: CGPA thresholds, degree compatibility, approved branch specializations,
              graduation batches, and mandatory technical skills.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Three clear states: Eligible, Partially Matched, Not Eligible</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Explicit breakdown of satisfied vs missing requirements</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--purple-light)',
              color: 'var(--purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Weighted Recommendation Engine
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Multi-factor scoring algorithm calculating skill overlap (40%), domain interest (30%),
              academic eligibility margin (20%), and work mode flexibility (10%).
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Scores ranked 0% - 100% with transparent reasoning</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Personalized explanations on why each internship is recommended</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-sm)',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              3 Role-Based Portals
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Dedicated, secure dashboards for Students, HR Recruiters, and System Administrators with
              real-time status updates and duplicate application prevention.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Pending, Shortlisted, Rejected, Selected pipeline</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Recruiter filtering by CGPA, skills, & qualifications</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Domain Highlights */}
      <section style={{ background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Internships by Domain</h2>
              <p style={{ color: 'var(--text-muted)' }}>Curated listings across core technology stacks</p>
            </div>
            <Link to="/internships" className="btn btn-outline">
              View All Opportunities <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {domains.map((dom, i) => {
              const Icon = dom.icon;
              return (
                <Link 
                  key={i} 
                  to={`/internships?keyword=${encodeURIComponent(dom.title)}`}
                  className="card card-hover"
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dom.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{dom.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dom.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
