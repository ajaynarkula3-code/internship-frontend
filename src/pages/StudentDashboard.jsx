import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Sparkles, 
  FileText, 
  User, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import InternshipCard from '../components/InternshipCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, recRes, appRes] = await Promise.allSettled([
        api.get('/students/me'),
        api.get('/recommendations'),
        api.get('/applications/my')
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (recRes.status === 'fulfilled') setRecommendations(recRes.value.data);
      if (appRes.status === 'fulfilled') setApplications(appRes.value.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = applications.filter(a => a.status === 'SELECTED').length;
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED').length;
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  const isProfileComplete = profile?.cgpa && profile?.degree && profile?.branch && profile?.skills?.length > 0;

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: 650, position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
            Student Workspace
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.3rem 0 0.75rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {isProfileComplete 
              ? `Your profile is configured with ${profile.skills.length} skills and ${profile.cgpa} CGPA. Our recommendation engine matched opportunities for your domain: ${profile.preferredDomain || 'All'}.`
              : 'Complete your academic profile and add your technical skills to get maximum eligibility and match accuracy.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/student/recommendations" className="btn btn-purple" style={{ background: 'white', color: 'var(--primary)' }}>
              <Sparkles size={16} />
              View Recommendations
            </Link>
            <Link to="/student/profile" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <User size={16} />
              {isProfileComplete ? 'Edit Profile' : 'Complete Profile Now'}
            </Link>
          </div>
        </div>
      </div>

      {!isProfileComplete && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span>Profile Incomplete: Set your CGPA, Degree, Branch, and Skills so employers can review your applications.</span>
          </div>
          <Link to="/student/profile" className="btn btn-primary btn-sm">
            Complete Profile
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-val">{recommendations.length}</div>
            <div className="stat-label">Recommended Roles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{applications.length}</div>
            <div className="stat-label">Applications Submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{shortlistedCount}</div>
            <div className="stat-label">Shortlisted by HR</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{selectedCount}</div>
            <div className="stat-label">Offers / Selected</div>
          </div>
        </div>
      </div>

      {/* Recommendations Highlights */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Top Recommended Internships</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Ranked highest based on your skills, CGPA margin, and domain interests
            </p>
          </div>
          <Link to="/student/recommendations" className="btn btn-outline btn-sm">
            See All Ranked Roles <ArrowRight size={14} />
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No recommendations found yet. Explore active listings!</p>
            <Link to="/internships" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Explore Internships
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {recommendations.slice(0, 3).map((rec, i) => (
              <InternshipCard
                key={rec.internship.id || i}
                internship={rec.internship}
                matchPercentage={rec.matchPercentage}
                eligibilityStatus={rec.eligibilityStatus}
                reasons={rec.reasons}
                onApplied={fetchDashboardData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications Preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Recent Applications</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time status updates from recruiters
            </p>
          </div>
          <Link to="/student/applications" className="btn btn-outline btn-sm">
            View Application History <ArrowRight size={14} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any internships yet.</p>
            <Link to="/internships" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Internship Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Admin / HR Notes</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong>{app.internshipTitle}</strong>
                    </td>
                    <td>{app.companyName}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        app.status === 'SELECTED' ? 'badge-eligible' :
                        app.status === 'SHORTLISTED' ? 'badge-partial' :
                        app.status === 'REJECTED' ? 'badge-ineligible' : 'badge-primary'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {app.adminNotes || 'Under review by hiring committee.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
