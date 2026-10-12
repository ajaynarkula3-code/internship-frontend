import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Search, GraduationCap, Award, ExternalLink, Mail, Phone } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase()) ||
      s.skills?.some(sk => sk.skillName.toLowerCase().includes(search.toLowerCase()));

    if (branchFilter !== 'All' && s.branch !== branchFilter) return false;
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <Users size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Talent Pool
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Registered Students & Profiles</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Inspect academic performance, technical skills, and candidate qualifications
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="form-control"
          placeholder="Search by student name, email, college, or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 250 }}
        />

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="All">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="Computer Applications">Computer Applications</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Academic Record</th>
                <th>CGPA</th>
                <th>Preferred Domain</th>
                <th>Key Skills</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.userId || student.id}>
                  <td>
                    <strong>{student.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={12} /> {student.email}
                    </div>
                    {student.phone && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={12} /> {student.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div><strong>{student.degree || 'Degree N/A'}</strong> - {student.branch || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {student.college || 'College not set'} • Batch of {student.graduationYear || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 800, 
                      color: student.cgpa >= 8.5 ? '#059669' : student.cgpa >= 7.0 ? 'var(--primary)' : 'var(--text-muted)' 
                    }}>
                      {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {student.preferredDomain || 'General'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: 300 }}>
                      {student.skills?.slice(0, 4).map((sk, idx) => (
                        <span key={idx} style={{ background: '#f1f5f9', color: '#1e293b', fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                          {sk.skillName}
                        </span>
                      ))}
                      {student.skills?.length > 4 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                          +{student.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {student.resumeUrl ? (
                      <a 
                        href={student.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <ExternalLink size={12} /> View
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
