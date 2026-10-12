import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function HRDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    setLoading(true);
    try {
      const [intRes, appRes] = await Promise.allSettled([
        api.get('/internships?all=true'),
        api.get('/applications')
      ]);

      if (intRes.status === 'fulfilled') setInternships(intRes.value.data);
      if (appRes.status === 'fulfilled') setApplications(appRes.value.data);
    } catch (err) {
      console.error('Error fetching HR dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;
  const selected = applications.filter(a => a.status === 'SELECTED').length;

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: 650 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
            Recruiter & Employer Portal
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.3rem 0 0.75rem' }}>
            Welcome, {user?.name}! 💼
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Manage your company's internship listings, evaluate applicant eligibility using automated scoring, and advance candidates through your interview pipeline.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/internships" className="btn btn-purple" style={{ background: 'white', color: 'var(--primary)' }}>
              <Plus size={16} /> Post New Internship
            </Link>
            <Link to="/hr/applicants" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Users size={16} /> Filter & Review Applicants
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-val">{internships.length}</div>
            <div className="stat-label">Active Job Openings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{applications.length}</div>
            <div className="stat-label">Total Applicants</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{shortlisted}</div>
            <div className="stat-label">Shortlisted Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{selected}</div>
            <div className="stat-label">Accepted / Hired</div>
          </div>
        </div>
      </div>

      {/* Jobs Overview */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Your Active Internship Listings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current job openings and applicant volumes</p>
          </div>
          <Link to="/admin/internships" className="btn btn-outline btn-sm">
            Manage All Jobs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Domain</th>
                <th>Work Mode</th>
                <th>Min CGPA</th>
                <th>Stipend</th>
                <th>Applicants</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {internships.slice(0, 5).map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.companyName} • {job.location}</div>
                  </td>
                  <td><span className="badge badge-purple">{job.domain}</span></td>
                  <td>{job.workMode}</td>
                  <td><strong>{job.minCgpa}</strong></td>
                  <td>₹{job.stipend?.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-primary">{job.applicantCount || 0} applicants</span>
                  </td>
                  <td>
                    <Link to="/hr/applicants" className="btn btn-outline btn-sm">
                      View Applicants
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
