import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import InternshipCard from '../components/InternshipCard';
import { Search, Filter, SlidersHorizontal, Briefcase, RefreshCw } from 'lucide-react';

export default function InternshipListings() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialKeyword);
  const [domainFilter, setDomainFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [maxCgpaFilter, setMaxCgpaFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchInternships();
  }, [search]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const url = search ? `/internships?keyword=${encodeURIComponent(search)}` : '/internships';
      const res = await api.get(url);
      setInternships(res.data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort client-side
  const filteredInternships = internships.filter(item => {
    if (domainFilter !== 'All' && !item.domain.toLowerCase().includes(domainFilter.toLowerCase())) {
      return false;
    }
    if (workModeFilter !== 'All' && item.workMode !== workModeFilter) {
      return false;
    }
    if (maxCgpaFilter && item.minCgpa > parseFloat(maxCgpaFilter)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'stipend') {
      return (b.stipend || 0) - (a.stipend || 0);
    }
    if (sortBy === 'cgpa') {
      return (a.minCgpa || 0) - (b.minCgpa || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Internship Opportunities</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover verified internships and verify your eligibility with one click
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 260 }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by role, company, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="All">All Domains</option>
            <option value="Software Development">Software Development</option>
            <option value="Java Development">Java Development</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
          >
            <option value="All">All Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={maxCgpaFilter}
            onChange={(e) => setMaxCgpaFilter(e.target.value)}
          >
            <option value="">CGPA Requirement: Any</option>
            <option value="7.0">Max Req CGPA: 7.0</option>
            <option value="7.5">Max Req CGPA: 7.5</option>
            <option value="8.0">Max Req CGPA: 8.0</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="stipend">Sort: Highest Stipend</option>
            <option value="cgpa">Sort: Lowest Min CGPA</option>
          </select>

          <button onClick={fetchInternships} className="btn btn-outline btn-sm" title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Fetching internships...</p>
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Briefcase size={36} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No internships found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Try resetting your search query or filters.
          </p>
          <button 
            onClick={() => { setSearch(''); setDomainFilter('All'); setWorkModeFilter('All'); setMaxCgpaFilter(''); }}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1rem' }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApplied={fetchInternships}
            />
          ))}
        </div>
      )}
    </div>
  );
}
