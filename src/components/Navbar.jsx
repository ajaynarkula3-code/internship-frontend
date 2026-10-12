import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  Sparkles, 
  FileText, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-badge">
            <Briefcase size={20} />
          </div>
          <span>SmartIntern</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ display: 'none' /* handled via CSS media query */ }}>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            
            <Link to="/internships" className={`nav-link ${isActive('/internships') ? 'active' : ''}`}>
              <Compass size={16} />
              Explore Internships
            </Link>

            {isAuthenticated && user?.role === 'STUDENT' && (
              <>
                <Link to="/student/recommendations" className={`nav-link ${isActive('/student/recommendations') ? 'active' : ''}`}>
                  <Sparkles size={16} color="#7c3aed" />
                  Recommendations
                </Link>
                <Link to="/student/applications" className={`nav-link ${isActive('/student/applications') ? 'active' : ''}`}>
                  <FileText size={16} />
                  My Applications
                </Link>
                <Link to="/student/dashboard" className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </Link>
                <Link to="/admin/internships" className={`nav-link ${isActive('/admin/internships') ? 'active' : ''}`}>
                  Manage Internships
                </Link>
                <Link to="/admin/applications" className={`nav-link ${isActive('/admin/applications') ? 'active' : ''}`}>
                  Applications
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'HR' && (
              <>
                <Link to="/hr/dashboard" className={`nav-link ${isActive('/hr/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={16} />
                  HR Dashboard
                </Link>
                <Link to="/hr/applicants" className={`nav-link ${isActive('/hr/applicants') ? 'active' : ''}`}>
                  <Users size={16} />
                  Applicants
                </Link>
                <Link to="/admin/internships" className={`nav-link ${isActive('/admin/internships') ? 'active' : ''}`}>
                  Manage Jobs
                </Link>
              </>
            )}
          </div>

          {/* User actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user?.role === 'STUDENT' && (
                  <Link to="/student/profile" className="btn btn-outline btn-sm">
                    <User size={15} />
                    <span>Profile</span>
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-alt)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span className={`badge ${user?.role === 'ADMIN' ? 'badge-purple' : user?.role === 'HR' ? 'badge-primary' : 'badge-gray'}`} style={{ fontSize: '0.7rem' }}>
                    {user?.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log out">
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
