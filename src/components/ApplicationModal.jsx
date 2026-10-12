import React, { useState } from 'react';
import { X, Send, Briefcase, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function ApplicationModal({ internship, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!internship) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/applications', {
        internshipId: internship.id,
        coverLetter: coverLetter.trim(),
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please check if you have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Briefcase size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Application Submission
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{internship.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {internship.companyName} • {internship.location} • ₹{internship.stipend?.toLocaleString()}/mo
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Cover Letter / Statement of Purpose (Optional)
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Highlight your key qualifications, relevant projects, and why you are interested in this internship..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div style={{ background: 'var(--surface-alt)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Note: Your student profile, CGPA, graduation batch, and listed technical skills will automatically be shared with the recruiter.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Send size={16} />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
