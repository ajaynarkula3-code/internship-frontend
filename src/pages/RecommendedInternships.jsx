import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import InternshipCard from '../components/InternshipCard';
import { Sparkles, Sliders, CheckCircle2, User, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RecommendedInternships() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/recommendations');
      setRecommendations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations. Please make sure you are logged in as a student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--purple)', marginBottom: '0.25rem' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intelligent Matching
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Personalized Internship Recommendations</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Ranked from highest to lowest match percentage based on skills, domain alignment, and academic eligibility.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchRecommendations} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Refresh Rankings
          </button>
          <Link to="/student/profile" className="btn btn-purple btn-sm">
            <User size={14} /> Update My Skills
          </Link>
        </div>
      </div>

      {/* Algorithm Transparency Box */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
        border: '1.5px solid var(--purple-border)',
        marginBottom: '2rem',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Sliders size={18} color="var(--purple)" />
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            How our Recommendation Algorithm works:
          </strong>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Our transparent rule-based algorithm weights: <strong>40% Skill Overlap</strong> (mandatory & optional skills), 
          <strong>30% Domain & Career Interest</strong>, <strong>20% Academic Merit & Eligibility Margin</strong> (CGPA surplus), and 
          <strong>10% Location / Work Mode Compatibility</strong>.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Running recommendation algorithm against your profile...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <AlertCircle size={36} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No recommendations yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: 450, margin: '0.25rem auto 1rem' }}>
            Please update your student profile with your CGPA, degree, branch, and technical skills so the recommendation algorithm can calculate matches.
          </p>
          <Link to="/student/profile" className="btn btn-primary">
            Complete Profile Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map((rec, idx) => (
            <InternshipCard
              key={rec.internship.id || idx}
              internship={rec.internship}
              matchPercentage={rec.matchPercentage}
              eligibilityStatus={rec.eligibilityStatus}
              reasons={rec.reasons}
              onApplied={fetchRecommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
