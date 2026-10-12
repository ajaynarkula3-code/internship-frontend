import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  GraduationCap, 
  Clock, 
  Users, 
  ShieldCheck, 
  Send, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import EligibilityModal from '../components/EligibilityModal';
import ApplicationModal from '../components/ApplicationModal';

export default function InternshipDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [checkingElig, setCheckingElig] = useState(false);
  const [showEligModal, setShowEligModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    fetchInternship();
    if (isAuthenticated && user?.role === 'STUDENT') {
      evaluateStudentEligibility();
    }
  }, [id, isAuthenticated]);

  const fetchInternship = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/internships/${id}`);
      setInternship(res.data);
    } catch (err) {
      console.error('Error fetching internship:', err);
    } finally {
      setLoading(false);
    }
  };

  const evaluateStudentEligibility = async () => {
    setCheckingElig(true);
    try {
      const res = await api.get(`/eligibility/${id}`);
      setEligibilityData(res.data);
    } catch (err) {
      console.warn('Could not auto-fetch eligibility:', err);
    } finally {
      setCheckingElig(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div style={{ maxWidth: 800, margin: '3rem auto', textAlign: 'center' }}>
        <h2>Internship Not Found</h2>
        <Link to="/internships" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back button */}
      <Link to="/internships" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to all internships
      </Link>

      {appliedSuccess && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          Your application has been successfully submitted! You can track its status in 'My Applications'.
        </div>
      )}

      {/* Main Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {internship.companyLogo ? (
              <img 
                src={internship.companyLogo} 
                alt={internship.companyName}
                style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: '#f8fafc', padding: 6, border: '1px solid var(--border)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                {internship.companyName?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2 }}>
                {internship.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                <Building2 size={16} />
                <strong>{internship.companyName}</strong>
                <span>•</span>
                <MapPin size={16} />
                <span>{internship.location}</span>
                <span>•</span>
                <span className="badge badge-purple">{internship.domain}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {user?.role === 'STUDENT' && (
              <>
                <button 
                  onClick={() => setShowEligModal(true)} 
                  className="btn btn-outline"
                >
                  <ShieldCheck size={16} /> Check Eligibility
                </button>
                <button 
                  onClick={() => setShowApplyModal(true)} 
                  className="btn btn-primary"
                >
                  <Send size={16} /> Apply Now
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          background: 'var(--surface-alt)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Stipend</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={16} /> {internship.stipend?.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/month</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Work Mode</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
              {internship.workMode}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Duration</span>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>
              {internship.durationMonths} Months
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Application Deadline</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626' }}>
              {internship.deadline}
            </div>
          </div>
        </div>
      </div>

      {/* Live Eligibility Banner for Logged-In Students */}
      {eligibilityData && (
        <div className="card" style={{
          border: `1.5px solid ${eligibilityData.status === 'Eligible' ? '#a7f3d0' : eligibilityData.status === 'Partially Matched' ? '#fde68a' : '#fecaca'}`,
          background: eligibilityData.status === 'Eligible' ? 'var(--success-light)' : eligibilityData.status === 'Partially Matched' ? 'var(--warning-light)' : 'var(--danger-light)',
          marginBottom: '2rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={18} color={eligibilityData.status === 'Eligible' ? '#059669' : '#d97706'} />
                <strong style={{ fontSize: '1.1rem' }}>Your Eligibility Status: {eligibilityData.status}</strong>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {eligibilityData.summary}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{eligibilityData.eligibilityScore}%</span>
                <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>Score</span>
              </div>
              <button onClick={() => setShowEligModal(true)} className="btn btn-outline btn-sm" style={{ background: 'white' }}>
                View Full Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Description & Eligibility Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Description */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Role Description</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
            {internship.description}
          </p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Required Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {internship.requiredSkills?.map((s, idx) => (
              <span 
                key={idx}
                style={{
                  background: s.mandatory ? 'var(--primary-light)' : 'var(--surface-alt)',
                  color: s.mandatory ? 'var(--primary-dark)' : 'var(--text-main)',
                  border: `1px solid ${s.mandatory ? '#bfdbfe' : 'var(--border)'}`,
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {s.skillName} {s.mandatory && '(Mandatory)'}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Configurable Eligibility Rules */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--primary)" />
            Eligibility Criteria
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Minimum CGPA
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {internship.minCgpa} / 10.0
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Eligible Degrees
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {internship.eligibleDegrees || 'Open to All Degrees'}
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Eligible Branches
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {internship.eligibleBranches || 'All Branches Accepted'}
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Eligible Graduation Batches
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {internship.eligibleGraduationYears || 'All Batches'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Location / Work Mode
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {internship.location} ({internship.workMode})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEligModal && eligibilityData && (
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
          }}
        />
      )}
    </div>
  );
}
