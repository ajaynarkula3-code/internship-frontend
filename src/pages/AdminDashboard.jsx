import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.allSettled([
        api.get('/dashboard/stats'),
        api.get('/applications')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (appsRes.status === 'fulfilled') setRecentApplications(appsRes.value.data);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Administration
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time platform metrics, applicant pipelines, and domain coverage
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/internships" className="btn btn-primary">
            <Plus size={16} /> Add Internship
          </Link>
          <Link to="/admin/applications" className="btn btn-outline">
            Review Applications
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalStudents || 0}</div>
            <div className="stat-label">Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalInternships || 0}</div>
            <div className="stat-label">Active Internships</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Award size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalSelected || 0}</div>
            <div className="stat-label">Selected Candidates</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Domain Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Pipeline Status Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Application Status Funnel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Selected Candidates</span>
                <strong>{stats?.totalSelected || 0}</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#10b981', width: `${((stats?.totalSelected || 0) / (stats?.totalApplications || 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Shortlisted for Rounds</span>
                <strong>{stats?.totalShortlisted || 0}</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#f59e0b', width: `${((stats?.totalShortlisted || 0) / (stats?.totalApplications || 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Pending Review</span>
                <strong>{stats?.totalPending || 0}</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#3b82f6', width: `${((stats?.totalPending || 0) / (stats?.totalApplications || 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Rejected</span>
                <strong>{stats?.totalRejected || 0}</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#ef4444', width: `${((stats?.totalRejected || 0) / (stats?.totalApplications || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Distribution Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--purple)" />
            Internships by Domain
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.domainCounts && Object.entries(stats.domainCounts).map(([dom, cnt], idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{dom}</span>
                <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>{cnt} listings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Candidate Applications</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Review students applying across active roles</p>
          </div>
          <Link to="/admin/applications" className="btn btn-outline btn-sm">
            Manage All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Degree / Branch</th>
                <th>CGPA</th>
                <th>Internship Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.slice(0, 6).map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.studentName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.studentEmail}</div>
                  </td>
                  <td>{app.studentDegree} - {app.studentBranch}</td>
                  <td>
                    <strong style={{ color: app.studentCgpa >= 8.0 ? '#059669' : 'var(--text-main)' }}>
                      {app.studentCgpa || 'N/A'}
                    </strong>
                  </td>
                  <td>
                    <div><strong>{app.internshipTitle}</strong></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.companyName}</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      app.status === 'SELECTED' ? 'badge-eligible' :
                      app.status === 'SHORTLISTED' ? 'badge-partial' :
                      app.status === 'REJECTED' ? 'badge-ineligible' : 'badge-primary'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/admin/applications" className="btn btn-outline btn-sm">
                      Review
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
