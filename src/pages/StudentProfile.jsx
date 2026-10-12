import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  X, 
  Save, 
  CheckCircle2, 
  MapPin, 
  BookOpen, 
  Award,
  Link as LinkIcon
} from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: 'B.Tech',
    branch: 'CSE',
    graduationYear: 2025,
    cgpa: 8.0,
    preferredDomain: 'Software Development',
    locationPreference: 'Remote',
    bio: '',
    resumeUrl: '',
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students/me');
      if (res.data) {
        setProfile({
          name: res.data.name || user?.name || '',
          email: res.data.email || user?.email || '',
          phone: res.data.phone || '',
          college: res.data.college || '',
          degree: res.data.degree || 'B.Tech',
          branch: res.data.branch || 'CSE',
          graduationYear: res.data.graduationYear || 2025,
          cgpa: res.data.cgpa || 8.0,
          preferredDomain: res.data.preferredDomain || 'Software Development',
          locationPreference: res.data.locationPreference || 'Remote',
          bio: res.data.bio || '',
          resumeUrl: res.data.resumeUrl || '',
          skills: res.data.skills || []
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    // Check duplicate
    if (profile.skills.some(s => s.skillName.toLowerCase() === newSkill.trim().toLowerCase())) {
      alert('Skill already added!');
      return;
    }

    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { skillName: newSkill.trim(), proficiencyLevel: proficiency }]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillName !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/students/me', profile);
      setMessage({ type: 'success', text: 'Student profile updated successfully! Match scores have been refreshed.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <User size={22} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Academic Profile
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Profile Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Keep your academic performance and skills updated to maximize your internship recommendations and pass automatic eligibility checks.
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Personal & Contact Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-Only)</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
                style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 98765 43210"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. National Institute of Technology"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Academic Details & Eligibility Criteria */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--primary)" />
            Academic Criteria (Used by Eligibility Engine)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <select
                className="form-control"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                required
              >
                <option value="B.Tech">B.Tech</option>
                <option value="B.E.">B.E.</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="B.Sc">B.Sc Computer Science</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Branch / Specialization</label>
              <select
                className="form-control"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                required
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="Data Science">Data Science / AI</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="Computer Applications">Computer Applications</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <select
                className="form-control"
                value={profile.graduationYear}
                onChange={(e) => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })}
                required
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current CGPA (Out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="10.0"
                className="form-control"
                value={profile.cgpa}
                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
        </div>

        {/* Preferences & Interests */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="var(--purple)" />
            Career Interests & Preferences
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred Internship Domain</label>
              <select
                className="form-control"
                value={profile.preferredDomain}
                onChange={(e) => setProfile({ ...profile, preferredDomain: e.target.value })}
                required
              >
                <option value="Software Development">Software Development</option>
                <option value="Java Development">Java Development</option>
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="Cloud Computing">Cloud Computing & DevOps</option>
                <option value="Cybersecurity">Cybersecurity & Networks</option>
                <option value="Data Analytics">Data Analytics & BI</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location Preference</label>
              <select
                className="form-control"
                value={profile.locationPreference}
                onChange={(e) => setProfile({ ...profile, locationPreference: e.target.value })}
                required
              >
                <option value="Remote">Remote Only</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Noida">Noida / Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Any">Flexible / Any Location</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Resume Link (Google Drive / GitHub / Portfolio URL)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://drive.google.com/your-resume-pdf"
                value={profile.resumeUrl}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Short Bio / Summary</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Summarize your technical strengths, open source projects, and goals..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Technical Skills Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#059669" />
            Technical Skills (Matched by Recommendation Engine)
          </h3>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Java, React, Python, Docker, Spring Boot..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />

            <select
              className="form-control"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              style={{ width: 160 }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button type="button" onClick={handleAddSkill} className="btn btn-purple">
              <Plus size={16} /> Add Skill
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skills?.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                No skills added yet. Add programming languages and tools above.
              </p>
            ) : (
              profile.skills.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    border: '1px solid #bfdbfe',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <span>{s.skillName}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>({s.proficiencyLevel})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.skillName)}
                    style={{ color: 'var(--primary)', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving Profile...' : 'Save & Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
