import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import EligibilityModal from './EligibilityModal';
import ApplicationModal from './ApplicationModal';

export default function InternshipCard({ 
  internship, 
  matchPercentage, 
  eligibilityStatus, 
  reasons,
  onApplied 
}) {
  const { user, isAuthenticated } = useAuth();
  const [eligibilityData, setEligibilityData] = useState(null);
  const [showEligModal, setShowEligModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [checkingElig, setCheckingElig] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleCheckEligibility = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setCheckingElig(true);
    try {
      const res = await api.get(`/eligibility/${internship.id}`);
      setEligibilityData(res.data);
      setShowEligModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check eligibility. Please ensure you are logged in as a student.');
    } finally {
      setCheckingElig(false);
    }
  };

  const getMatchPill = (pct) => {
    if (!pct) return null;
    let cls = 'match-low';
    if (pct >= 75) cls = 'match-high';
    else if (pct >= 50) cls = 'match-mid';

    return (
      <span className={`match-pill ${cls}`} title="Recommendation Score">
        <Sparkles size={13} />
        {pct}% Match
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'Eligible') {
      return <span className="badge badge-eligible"><CheckCircle2 size={12} /> Eligible</span>;
    }
    if (status === 'Partially Matched') {
      return <span className="badge badge-partial"><AlertCircle size={12} /> Partially Matched</span>;
    }
    if (status === 'Not Eligible') {
      return <span className="badge badge-ineligible"><XCircle size={12} /> Not Eligible</span>;
    }
    return null;
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          {internship.companyLogo ? (
            <img 
              src={internship.companyLogo} 
              alt={internship.companyName}
              style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: '#f8fafc', padding: 4, border: '1px solid var(--border)' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {internship.companyName?.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {internship.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              <Building2 size={14} />
              <span>{internship.companyName}</span>
              <span>•</span>
              <MapPin size={14} />
              <span>{internship.location}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          {getMatchPill(matchPercentage)}
          {getStatusBadge(eligibilityStatus)}
        </div>
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className="badge badge-purple">
          {internship.domain}
        </span>
        <span className="badge badge-primary">
          {internship.workMode}
        </span>
        <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Calendar size={12} />
          {internship.durationMonths} Mos
        </span>
        <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <GraduationCap size={12} />
          Min CGPA: {internship.minCgpa}
        </span>
      </div>

      {/* Description Snippet */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {internship.description}
      </p>

      {/* Required Skills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
          Required Skills:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {internship.requiredSkills?.slice(0, 4).map((s, idx) => (
            <span key={idx} style={{ 
              background: '#f1f5f9', 
              color: '#334155', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              padding: '0.2rem 0.55rem', 
              borderRadius: 6,
              border: s.mandatory ? '1px solid #cbd5e1' : 'none'
            }}>
              {s.skillName} {s.mandatory && '*'}
            </span>
          ))}
          {internship.requiredSkills?.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>
              +{internship.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Recommendation Reason if provided */}
      {reasons && reasons.length > 0 && (
        <div style={{ background: 'var(--purple-light)', borderLeft: '3px solid var(--purple)', padding: '0.5rem 0.75rem', borderRadius: 4, marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.775rem', color: '#5b21b6', fontStyle: 'italic' }}>
            <strong>Why Recommended:</strong> {reasons[0]}
          </p>
        </div>
      )}

      {/* Bottom Footer / Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stipend</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={15} />
            {internship.stipend?.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {user?.role === 'STUDENT' && (
            <button 
              onClick={handleCheckEligibility}
              disabled={checkingElig}
              className="btn btn-outline btn-sm"
              title="Inspect Rule-Based Eligibility"
            >
              <ShieldCheck size={14} />
              {checkingElig ? 'Checking...' : 'Eligibility'}
            </button>
          )}

          <Link to={`/internships/${internship.id}`} className="btn btn-outline btn-sm">
            Details
          </Link>

          {user?.role === 'STUDENT' && (
            <button 
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Send size={13} />
              Apply
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEligModal && (
        <EligibilityModal 
          eligibility={eligibilityData} 
          onClose={() => setShowEligModal(false)}
          onApply={() => setShowApplyModal(true)}
        />
      )}

      {showApplyModal && (
        <ApplicationModal 
          internship={internship}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setAppliedSuccess(true);
            onApplied?.();
          }}
        />
      )}
    </div>
  );
}
