import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = { pending: 'badge-gray', reviewed: 'badge-blue', shortlisted: 'badge-green', rejected: 'badge-red', hired: 'badge-purple' };

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/my/applications')
      .then(res => { setApplications(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>My Applications</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Track all your job applications</p>

        {applications.length === 0 ? (
          <div className="empty-state card">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs to track your progress here</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Jobs</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {applications.map(app => (
              <div key={app._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 4 }}>{app.job?.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{app.job?.company} · {app.job?.location} · {app.job?.type}</p>
                  {app.job?.salaryMin && (
                    <p style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2 }}>
                      ${app.job.salaryMin.toLocaleString()}{app.job.salaryMax ? ` – $${app.job.salaryMax.toLocaleString()}` : '+'}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  {app.employerNote && (
                    <p style={{ fontSize: 13, color: 'var(--primary)', marginTop: 6, fontStyle: 'italic' }}>
                      💬 Employer note: "{app.employerNote}"
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
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

export default MyApplications;
