import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Edit3, 
  X, 
  Save, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Status Update Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      await api.put(`/applications/${selectedApp.id}/status`, {
        status: newStatus,
        adminNotes: adminNotes.trim()
      });
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter(app => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    const matchesSearch = 
      app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      app.internshipTitle?.toLowerCase().includes(search.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <FileText size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recruitment Funnel
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review candidate eligibility, skills, and update hiring pipeline status
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="form-control"
          placeholder="Search by student, role, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 260 }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'PENDING', 'SHORTLISTED', 'SELECTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Academic Profile</th>
                <th>Role & Company</th>
                <th>Engine Match</th>
                <th>Current Status</th>
                <th>Notes / Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.studentName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.studentEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{app.studentDegree} - {app.studentBranch}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      CGPA: <strong style={{ color: app.studentCgpa >= 8.0 ? '#059669' : 'var(--text-main)' }}>{app.studentCgpa || 'N/A'}</strong> • Batch {app.studentGraduationYear || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <strong>{app.internshipTitle}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.companyName}</div>
                  </td>
                  <td>
                    {app.matchPercentage ? (
                      <span className={`match-pill ${app.matchPercentage >= 75 ? 'match-high' : 'match-mid'}`}>
                        <Sparkles size={12} /> {app.matchPercentage}%
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>N/A</span>
                    )}
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
                    <button onClick={() => openUpdateModal(app)} className="btn btn-outline btn-sm">
                      <Edit3 size={13} /> Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Status Update */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Update Application Status</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {selectedApp.studentName} for {selectedApp.internshipTitle}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Application Status</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="PENDING">PENDING (Under Initial Review)</option>
                  <option value="SHORTLISTED">SHORTLISTED (Selected for Next Interview Round)</option>
                  <option value="SELECTED">SELECTED (Hired / Offer Extended)</option>
                  <option value="REJECTED">REJECTED (Not Matched)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Feedback / Recruiter Notes</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Provide interview schedule, feedback, or decision rationale..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  <Save size={16} /> {updating ? 'Updating...' : 'Save Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
