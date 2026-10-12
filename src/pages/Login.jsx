import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'HR') {
        navigate('/hr/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 73px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
    }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div className="logo-badge" style={{ margin: '0 auto 1rem', width: 44, height: 44 }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sign in to Smart Internship System
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Register as Student
            </Link>
          </p>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '0.75rem' }}>
              1-Click Demo Accounts (Click to Autofill)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button 
                type="button"
                onClick={() => handleQuickLogin('admin@smartintern.com', 'admin123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <ShieldCheck size={14} color="#7c3aed" /> Admin
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('hr@google.com', 'hr123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <Briefcase size={14} color="#2563eb" /> HR Recruiter
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('rahul@gmail.com', 'student123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <UserCheck size={14} color="#10b981" /> Rahul (8.8 CGPA)
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('amit@gmail.com', 'student123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <UserCheck size={14} color="#f59e0b" /> Amit (6.9 CGPA)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
