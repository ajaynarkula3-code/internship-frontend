import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronDown,
  Edit3,
  X,
  Save
} from 'lucide-react';

export default function HRApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Update modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (appId, status, defaultNote) => {
    try {
      await api.put(`/applications/${appId}/status`, {
        status: status,
        adminNotes: defaultNote
      });
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      await api.put(`/applications/${selectedApp.id}/status`, {
        status: newStatus,
        adminNotes: adminNotes.trim()
      });
      setSelectedApp(null);
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  // Filter logic according to prompt requirements:
  // "Filter applicants according to eligibility, CGPA, skills, and qualification."
  const filteredApplicants = applicants.filter(app => {
    // 1. Text Search
    const searchMatch = 
      app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      app.internshipTitle?.toLowerCase().includes(search.toLowerCase()) ||
      app.studentEmail?.toLowerCase().includes(search.toLowerCase());
    if (!searchMatch) return false;

    // 2. Eligibility filter
    if (eligibilityFilter !== 'All') {
      if (app.eligibilityStatus !== eligibilityFilter) return false;
    }

    // 3. Min CGPA filter
    if (minCgpaFilter) {
      if (!app.studentCgpa || app.studentCgpa < parseFloat(minCgpaFilter)) return false;
    }

    // 4. Skills filter
    if (skillFilter.trim()) {
      const targetSkill = skillFilter.toLowerCase().trim();
      const hasSkill = app.studentSkills?.some(s => s.toLowerCase().includes(targetSkill));
      if (!hasSkill) return false;
    }

    // 5. Qualification / Degree filter
    if (degreeFilter !== 'All') {
      if (!app.studentDegree?.toLowerCase().includes(degreeFilter.toLowerCase())) return false;
    }

    // 6. Application status filter
    if (statusFilter !== 'All') {
      if (app.status !== statusFilter) return false;
    }

    return true;
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <Users size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recruiter Candidate Portal
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>HR Applicant Review & Screening</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Filter applicants according to eligibility engine results, CGPA, skills, and degree qualifications.
        </p>
      </div>

      {/* Advanced Filter Box */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Filter size={18} color="var(--primary)" />
          <strong style={{ fontSize: '0.95rem' }}>Screening & Multi-Filter Controls</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Name / Role</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul, Java..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Eligibility Engine Result</label>
            <select
              className="form-control"
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
            >
              <option value="All">All Eligibility Outcomes</option>
              <option value="Eligible">Eligible Only</option>
              <option value="Partially Matched">Partially Matched</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Minimum Student CGPA</label>
            <select
              className="form-control"
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
            >
              <option value="">CGPA: Any</option>
              <option value="7.0">CGPA ≥ 7.0</option>
              <option value="7.5">CGPA ≥ 7.5</option>
              <option value="8.0">CGPA ≥ 8.0</option>
              <option value="8.5">CGPA ≥ 8.5</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Specific Skill</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Python, Docker, Spring..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Degree / Qualification</label>
            <select
              className="form-control"
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
            >
              <option value="All">All Degrees</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Application Pipeline Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Pipeline Stages</option>
              <option value="PENDING">PENDING</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="SELECTED">SELECTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredApplicants.length}</strong> matching candidates
        </span>
        {(search || eligibilityFilter !== 'All' || minCgpaFilter || skillFilter || degreeFilter !== 'All' || statusFilter !== 'All') && (
          <button 
            onClick={() => {
              setSearch('');
              setEligibilityFilter('All');
              setMinCgpaFilter('');
              setSkillFilter('');
              setDegreeFilter('All');
              setStatusFilter('All');
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Applicants List */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Users size={36} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No applicants match your filter criteria</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Try relaxing the minimum CGPA, skill, or degree filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredApplicants.map((app) => (
            <div key={app.id} className="card card-hover" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {app.studentName}
                    </h3>
                    <span className={`badge ${
                      app.status === 'SELECTED' ? 'badge-eligible' :
                      app.status === 'SHORTLISTED' ? 'badge-partial' :
                      app.status === 'REJECTED' ? 'badge-ineligible' : 'badge-primary'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span>{app.studentEmail}</span>
                    {app.studentPhone && <span>• {app.studentPhone}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {app.eligibilityStatus && (
                    <span className={`badge ${
                      app.eligibilityStatus === 'Eligible' ? 'badge-eligible' :
                      app.eligibilityStatus === 'Partially Matched' ? 'badge-partial' : 'badge-ineligible'
                    }`}>
                      <ShieldCheck size={13} /> {app.eligibilityStatus}
                    </span>
                  )}
                  {app.matchPercentage && (
                    <span className={`match-pill ${app.matchPercentage >= 75 ? 'match-high' : 'match-mid'}`}>
                      <Sparkles size={12} /> {app.matchPercentage}% Match
                    </span>
                  )}
                </div>
              </div>

              {/* Applicant Profile Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                background: 'var(--surface-alt)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Degree & College</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{app.studentDegree} ({app.studentBranch})</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.studentCollege || 'College not listed'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Academic Performance</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: app.studentCgpa >= 8.0 ? '#059669' : 'var(--text-main)' }}>
                    {app.studentCgpa ? `${app.studentCgpa} CGPA` : 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class of {app.studentGraduationYear}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Position Applied For</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{app.internshipTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.companyName}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Resume Link</span>
                  <div>
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ExternalLink size={12} /> View Resume
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Candidate Skills:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {app.studentSkills?.map((sk, idx) => (
                    <span key={idx} style={{ background: '#f1f5f9', color: '#1e293b', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {app.coverLetter && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                  "{app.coverLetter}"
                </p>
              )}

              {/* Admin / HR notes */}
              {app.adminNotes && (
                <div style={{ background: 'var(--purple-light)', borderLeft: '3px solid var(--purple)', padding: '0.5rem 0.75rem', borderRadius: 4, marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#5b21b6' }}>
                    <strong>HR Notes:</strong> {app.adminNotes}
                  </p>
                </div>
              )}

              {/* Action Buttons for HR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Applied on {new Date(app.appliedDate).toLocaleDateString()}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleQuickStatusChange(app.id, 'SHORTLISTED', 'Candidate shortlisted for interview round.')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#d97706', borderColor: '#fde68a' }}
                    title="Shortlist applicant"
                  >
                    <Clock size={13} /> Shortlist
                  </button>

                  <button 
                    onClick={() => handleQuickStatusChange(app.id, 'SELECTED', 'Candidate offered internship.')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#059669', borderColor: '#a7f3d0' }}
                    title="Select and extend offer"
                  >
                    <CheckCircle2 size={13} /> Select
                  </button>

                  <button 
                    onClick={() => handleQuickStatusChange(app.id, 'REJECTED', 'Criteria did not match role profile.')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    title="Reject applicant"
                  >
                    <XCircle size={13} /> Reject
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedApp(app);
                      setNewStatus(app.status);
                      setAdminNotes(app.adminNotes || '');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Edit3 size={13} /> Add Custom Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for detailed custom feedback */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>HR Applicant Decision</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {selectedApp.studentName} • {selectedApp.internshipTitle}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSave}>
              <div className="form-group">
                <label className="form-label">Decision Status</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="PENDING">PENDING (Under Screening)</option>
                  <option value="SHORTLISTED">SHORTLISTED (Interview Round Scheduled)</option>
                  <option value="SELECTED">SELECTED (Offer Extended)</option>
                  <option value="REJECTED">REJECTED (Not Matched)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Recruiter Feedback / Internal Notes</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Record interview observations, skill assessment results, or next steps..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  <Save size={16} /> {updating ? 'Saving...' : 'Save Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
