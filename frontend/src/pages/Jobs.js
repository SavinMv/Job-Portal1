import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import './Jobs.css';

const CATEGORIES = ['', 'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Operations'];
const TYPES = ['', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const Jobs = () => {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page, limit: 12 });
      if (search) query.append('search', search);
      if (category) query.append('category', category);
      if (type) query.append('type', type);
      if (location) query.append('location', location);
      const { data } = await axios.get(`/api/jobs?${query}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page, category, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="jobs-page page">
      <div className="container">
        <div className="jobs-header">
          <h1>Browse Jobs</h1>
          <span className="jobs-count">{total} opportunities found</span>
        </div>

        {/* Filters */}
        <div className="filters-bar card">
          <form className="filters-form" onSubmit={handleSearch}>
            <input
              type="text" placeholder="🔍 Job title or keyword..."
              className="form-input filter-input"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <input
              type="text" placeholder="📍 Location..."
              className="form-input filter-input"
              value={location} onChange={e => setLocation(e.target.value)}
            />
            <select className="form-select filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {CATEGORIES.filter(c => c).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select filter-select" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              {TYPES.filter(t => t).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '300px' }}><div className="spinner"></div></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔎</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid-3">
              {jobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
