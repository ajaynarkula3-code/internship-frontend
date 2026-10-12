import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  Save, 
  CheckCircle2, 
  IndianRupee,
  Calendar,
  GraduationCap
} from 'lucide-react';

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    companyName: '',
    companyLogo: '',
    domain: 'Software Development',
    description: '',
    location: 'Bangalore',
    workMode: 'HYBRID',
    durationMonths: 6,
    stipend: 35000,
    openings: 5,
    deadline: '',
    minCgpa: 7.0,
    eligibleDegrees: 'B.Tech, B.E., BCA, MCA',
    eligibleBranches: 'CSE, IT, ECE',
    eligibleGraduationYears: '2024, 2025, 2026',
    active: true,
    requiredSkills: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/internships?all=true');
      setInternships(res.data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      companyName: '',
      companyLogo: '',
      domain: 'Software Development',
      description: '',
      location: 'Bangalore',
      workMode: 'HYBRID',
      durationMonths: 6,
      stipend: 35000,
      openings: 5,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minCgpa: 7.0,
      eligibleDegrees: 'B.Tech, B.E., BCA, MCA',
      eligibleBranches: 'CSE, IT, ECE',
      eligibleGraduationYears: '2024, 2025, 2026',
      active: true,
      requiredSkills: [
        { skillName: 'Java', mandatory: true },
        { skillName: 'MySQL', mandatory: true }
      ]
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      companyName: item.companyName,
      companyLogo: item.companyLogo || '',
      domain: item.domain,
      description: item.description,
      location: item.location,
      workMode: item.workMode,
      durationMonths: item.durationMonths,
      stipend: item.stipend,
      openings: item.openings,
      deadline: item.deadline,
      minCgpa: item.minCgpa,
      eligibleDegrees: item.eligibleDegrees || 'All',
      eligibleBranches: item.eligibleBranches || 'All',
      eligibleGraduationYears: item.eligibleGraduationYears || 'All',
      active: item.active,
      requiredSkills: item.requiredSkills ? [...item.requiredSkills] : []
    });
    setShowModal(true);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setForm(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, { skillName: skillInput.trim(), mandatory: isMandatory }]
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (idx) => {
    setForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await api.put(`/internships/${editingId}`, form);
      } else {
        await api.post('/internships', form);
      }
      setShowModal(false);
      fetchInternships();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save internship.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/internships/${id}`);
      fetchInternships();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete internship.');
    }
  };

  const filtered = internships.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.companyName.toLowerCase().includes(search.toLowerCase()) ||
    i.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Listings Management
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Internship Opportunities</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Post opportunities and configure automated eligibility rules
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Post New Internship
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar">
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="form-control"
          placeholder="Search listings by title, company, or domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
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
                <th>Title & Company</th>
                <th>Domain & Mode</th>
                <th>Eligibility Criteria</th>
                <th>Stipend</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {item.companyName} • {item.location}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{item.domain}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {item.workMode} • {item.durationMonths} Mos
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem' }}>
                      <strong>Min CGPA:</strong> {item.minCgpa}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Degrees: {item.eligibleDegrees || 'All'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Batches: {item.eligibleGraduationYears || 'All'}
                    </div>
                  </td>
                  <td>
                    <strong>₹{item.stipend?.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className="badge badge-primary">{item.applicantCount || 0} applied</span>
                  </td>
                  <td>
                    <span className={`badge ${item.active ? 'badge-eligible' : 'badge-ineligible'}`}>
                      {item.active ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => openEditModal(item)} className="btn btn-outline btn-sm" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.title)} className="btn btn-outline btn-sm" style={{ color: '#dc2626' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {editingId ? 'Edit Internship Listing' : 'Post New Internship'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Backend Java Developer Intern"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Microsoft"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Domain</label>
                  <select
                    className="form-control"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Java Development">Java Development</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Bangalore or Remote"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select
                    className="form-control"
                    value={form.workMode}
                    onChange={(e) => setForm({ ...form, workMode: e.target.value })}
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Stipend (INR)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={form.stipend}
                    onChange={(e) => setForm({ ...form, stipend: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Months)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={form.durationMonths}
                    onChange={(e) => setForm({ ...form, durationMonths: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Openings</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={form.openings}
                    onChange={(e) => setForm({ ...form, openings: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>
              </div>

              {/* Eligibility Rules */}
              <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GraduationCap size={16} color="var(--primary)" />
                  Automated Eligibility Engine Rules
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Minimum Required CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={form.minCgpa}
                      onChange={(e) => setForm({ ...form, minCgpa: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Eligible Degrees (Comma-separated or 'All')</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.eligibleDegrees}
                      onChange={(e) => setForm({ ...form, eligibleDegrees: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Eligible Branches (Comma-separated or 'All')</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.eligibleBranches}
                      onChange={(e) => setForm({ ...form, eligibleBranches: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Eligible Batches (e.g. 2025, 2026 or 'All')</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.eligibleGraduationYears}
                      onChange={(e) => setForm({ ...form, eligibleGraduationYears: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Required Skills Editor */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Required Skills Configuration</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Skill name (e.g. Java, Docker, React)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isMandatory}
                      onChange={(e) => setIsMandatory(e.target.checked)}
                    />
                    Mandatory
                  </label>
                  <button type="button" onClick={handleAddSkill} className="btn btn-outline btn-sm">
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {form.requiredSkills?.map((sk, idx) => (
                    <span 
                      key={idx}
                      style={{
                        background: sk.mandatory ? 'var(--primary-light)' : 'var(--surface-alt)',
                        color: sk.mandatory ? 'var(--primary-dark)' : 'var(--text-main)',
                        border: '1px solid var(--border)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {sk.skillName} {sk.mandatory && '*'}
                      <button type="button" onClick={() => handleRemoveSkill(idx)} style={{ color: '#dc2626' }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Responsibilities</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
