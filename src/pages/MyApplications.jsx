import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  Calendar, 
  IndianRupee, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="badge badge-eligible"><CheckCircle2 size={13} /> Selected / Hired</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-partial"><Clock size={13} /> Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge badge-ineligible"><XCircle size={13} /> Rejected</span>;
      default:
        return <span className="badge badge-primary"><AlertCircle size={13} /> Pending Review</span>;
    }
  };

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <FileText size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Application Tracking
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Internship Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Monitor your application lifecycle and feedback in real-time.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <FileText size={40} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No applications submitted yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Explore opportunities and apply to suitable internships.
          </p>
          <Link to="/internships" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Browse Internships
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="card card-hover" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {app.internshipTitle}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <Building2 size={15} /> {app.companyName}
                    </span>
                    <span>•</span>
                    <span className="badge badge-purple">{app.domain}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Calendar size={14} /> Applied on {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Cover Letter excerpt */}
              {app.coverLetter && (
                <div style={{ background: 'var(--surface-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Your Cover Letter / Note:
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{app.coverLetter}"
                  </p>
                </div>
              )}

              {/* Recruiter / Admin notes */}
              {app.adminNotes && (
                <div style={{
                  background: app.status === 'SELECTED' ? 'var(--success-light)' : app.status === 'REJECTED' ? 'var(--danger-light)' : 'var(--purple-light)',
                  borderLeft: `3px solid ${app.status === 'SELECTED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#7c3aed'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: 4,
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <MessageSquare size={14} color="var(--primary)" />
                    <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Recruiter Feedback / Status Note:</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {app.adminNotes}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Stipend: <strong>₹{app.stipend?.toLocaleString()}/mo</strong> • Location: <strong>{app.location}</strong>
                </div>

                <Link to={`/internships/${app.internshipId}`} className="btn btn-outline btn-sm">
                  View Role Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
