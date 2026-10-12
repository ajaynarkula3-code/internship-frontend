import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, X, ShieldAlert, Award } from 'lucide-react';

export default function EligibilityModal({ eligibility, onClose, onApply }) {
  if (!eligibility) return null;

  const getStatusBadge = (status) => {
    if (status === 'Eligible') {
      return (
        <span className="badge badge-eligible" style={{ fontSize: '0.95rem', padding: '0.4rem 1rem' }}>
          <CheckCircle2 size={16} /> Eligible
        </span>
      );
    }
    if (status === 'Partially Matched') {
      return (
        <span className="badge badge-partial" style={{ fontSize: '0.95rem', padding: '0.4rem 1rem' }}>
          <AlertCircle size={16} /> Partially Matched
        </span>
      );
    }
    return (
      <span className="badge badge-ineligible" style={{ fontSize: '0.95rem', padding: '0.4rem 1rem' }}>
        <XCircle size={16} /> Not Eligible
      </span>
    );
  };

  const getCheckIcon = (detailStatus) => {
    if (detailStatus === 'SATISFIED') {
      return <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />;
    }
    if (detailStatus === 'PARTIAL') {
      return <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />;
    }
    return <XCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Award size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Eligibility Engine Analysis
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {eligibility.internshipTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Company: <strong>{eligibility.companyName}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Status Banner */}
        <div style={{
          background: eligibility.status === 'Eligible' ? 'var(--success-light)' : eligibility.status === 'Partially Matched' ? 'var(--warning-light)' : 'var(--danger-light)',
          border: `1.5px solid ${eligibility.status === 'Eligible' ? '#a7f3d0' : eligibility.status === 'Partially Matched' ? '#fde68a' : '#fecaca'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ marginBottom: '0.35rem' }}>{getStatusBadge(eligibility.status)}</div>
            <p style={{ fontSize: '0.875rem', color: eligibility.status === 'Eligible' ? '#065f46' : eligibility.status === 'Partially Matched' ? '#92400e' : '#991b1b', fontWeight: 500 }}>
              {eligibility.summary}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {eligibility.eligibilityScore}%
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Eligibility Score
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Rules */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Eligibility Rules Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {eligibility.checkDetails?.map((detail, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                {getCheckIcon(detail.status)}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {detail.criteria}
                    </strong>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: detail.status === 'SATISFIED' ? '#059669' : detail.status === 'PARTIAL' ? '#d97706' : '#dc2626'
                    }}>
                      {detail.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {detail.reason}
                  </p>
                  <div style={{ fontSize: '0.75rem', display: 'flex', gap: '1rem', color: 'var(--text-light)' }}>
                    <span>Your Profile: <strong style={{ color: 'var(--text-main)' }}>{detail.studentValue || 'N/A'}</strong></span>
                    <span>Required: <strong style={{ color: 'var(--text-main)' }}>{detail.requiredValue || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          {onApply && (
            <button 
              onClick={() => {
                onClose();
                onApply();
              }} 
              className={`btn ${eligibility.status === 'Eligible' ? 'btn-primary' : 'btn-purple'}`}
            >
              Proceed to Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
