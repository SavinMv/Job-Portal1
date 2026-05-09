import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import './Dashboard.css';

const EmployerDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs/employer/myjobs')
      .then(res => { setJobs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    await axios.delete(`/api/jobs/${id}`);
    setJobs(jobs.filter(j => j._id !== id));
  };

  const toggleActive = async (job) => {
    const updated = await axios.put(`/api/jobs/${job._id}`, { isActive: !job.isActive });
    setJobs(jobs.map(j => j._id === job._id ? updated.data : j));
  };

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1>Welcome, {user.companyName || user.name}! 🏢</h1>
          <p>Manage your job postings and applications</p>
        </div>
        <Link to="/post-job" className="btn btn-accent btn-lg">+ Post New Job</Link>
      </div>

      <div className="dash-stats grid-3">
        <div className="stat-card card">
          <div className="stat-num">{jobs.length}</div>
          <div className="stat-label">Total Jobs Posted</div>
        </div>
        <div className="stat-card card">
          <div className="stat-num">{jobs.filter(j => j.isActive).length}</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-card card">
          <div className="stat-num">{jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0)}</div>
          <div className="stat-label">Total Applications</div>
        </div>
      </div>

      <div className="dash-section">
        <h2>Your Job Postings</h2>
        {loading ? <div className="spinner" /> : jobs.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>📋</div>
            <h3>No jobs posted yet</h3>
            <p>Start attracting talent by posting your first job</p>
            <Link to="/post-job" className="btn btn-primary" style={{ marginTop: 16 }}>Post a Job</Link>
          </div>
        ) : (
          <div className="employer-jobs">
            {jobs.map(job => (
              <div key={job._id} className="card employer-job-row">
                <div className="ej-info">
                  <h3>{job.title}</h3>
                  <p>{job.location} · {job.type}</p>
                  <p className="ej-apps">{job.applicationsCount || 0} applications</p>
                </div>
                <div className="ej-actions">
                  <span className={`badge ${job.isActive ? 'badge-green' : 'badge-gray'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Link to={`/job/${job._id}/applicants`} className="btn btn-secondary btn-sm">View Applicants</Link>
                  <Link to={`/edit-job/${job._id}`} className="btn btn-outline btn-sm">Edit</Link>
                  <button onClick={() => toggleActive(job)} className="btn btn-outline btn-sm">
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteJob(job._id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const JobseekerDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/my/applications')
      .then(res => { setApplications(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusColor = { pending: 'badge-gray', reviewed: 'badge-blue', shortlisted: 'badge-green', rejected: 'badge-red', hired: 'badge-purple' };

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Track your applications and find new opportunities</p>
        </div>
        <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs</Link>
      </div>

      <div className="dash-stats grid-4">
        <div className="stat-card card"><div className="stat-num">{applications.length}</div><div className="stat-label">Total Applied</div></div>
        <div className="stat-card card"><div className="stat-num">{applications.filter(a => a.status === 'pending').length}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card card"><div className="stat-num">{applications.filter(a => a.status === 'shortlisted').length}</div><div className="stat-label">Shortlisted</div></div>
        <div className="stat-card card"><div className="stat-num">{applications.filter(a => a.status === 'hired').length}</div><div className="stat-label">Hired 🎉</div></div>
      </div>

      <div className="dash-section">
        <h2>My Applications</h2>
        {loading ? <div className="spinner" /> : applications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🚀</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Find Jobs</Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map(app => (
              <div key={app._id} className="card application-row">
                <div className="app-info">
                  <h3>{app.job?.title || 'Job'}</h3>
                  <p className="app-company">{app.job?.company} · {app.job?.location}</p>
                  <p className="app-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  {app.employerNote && <p className="app-note">📝 "{app.employerNote}"</p>}
                </div>
                <div className="app-status">
                  <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <Link to={`/jobs/${app.job?._id}`} className="btn btn-outline btn-sm">View Job</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="page dashboard-page">
      <div className="container">
        {user?.role === 'employer' ? <EmployerDashboard user={user} /> : <JobseekerDashboard user={user} />}
      </div>
    </div>
  );
};

export default Dashboard;
