import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import './Home.css';

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Operations'];

const Home = () => {
  const [search, setSearch] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/jobs?limit=6').then(res => setRecentJobs(res.data.jobs));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 10,000+ Jobs Available</div>
          <h1 className="hero-title">Find Your Dream<br /><span className="gradient-text">Career Today</span></h1>
          <p className="hero-subtitle">Connect with top employers across all industries. Your next opportunity is just one search away.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg search-btn">Search Jobs</button>
          </form>

          <div className="hero-stats">
            <div className="stat"><strong>50K+</strong><span>Active Jobs</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>25K+</strong><span>Companies</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>1M+</strong><span>Job Seekers</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Explore opportunities across all major industries</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/jobs?category=${cat}`} className="category-card">
                <span className="category-name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Opportunities</h2>
            <Link to="/jobs" className="btn btn-outline">View All →</Link>
          </div>
          <div className="jobs-grid">
            {recentJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-card cta-seeker">
            <div className="cta-icon">👤</div>
            <h3>Looking for a Job?</h3>
            <p>Create your profile and get discovered by top employers</p>
            <Link to="/register?role=jobseeker" className="btn btn-primary">Get Started Free</Link>
          </div>
          <div className="cta-card cta-employer">
            <div className="cta-icon">🏢</div>
            <h3>Hiring Talent?</h3>
            <p>Post jobs and connect with thousands of qualified candidates</p>
            <Link to="/register?role=employer" className="btn btn-accent">Post a Job</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
