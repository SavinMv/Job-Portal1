import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
const statusColor = { pending: 'badge-gray', reviewed: 'badge-blue', shortlisted: 'badge-green', rejected: 'badge-red', hired: 'badge-purple' };

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    Promise.all([
      axios.get(`/api/jobs/${jobId}`),
      axios.get(`/api/applications/job/${jobId}`)
    ]).then(([jobRes, appRes]) => {
      setJob(jobRes.data);
      setApplications(appRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    const note = notes[appId] || '';
    const res = await axios.put(`/api/applications/${appId}/status`, { status, employerNote: note });
    setApplications(applications.map(a => a._id === appId ? { ...a, status: res.data.status, employerNote: res.data.employerNote } : a));
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ marginBottom: 16 }}>← Back to Dashboard</Link>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Applicants for: {job?.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{applications.length} total applicants · {job?.location} · {job?.type}</p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state card">
            <div style={{ fontSize: 48 }}>👥</div>
            <h3>No applicants yet</h3>
            <p>Share your job posting to attract candidates</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {applications.map(app => (
              <div key={app._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #6B8EFF)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 18, flexShrink: 0
                      }}>
                        {app.applicant?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, marginBottom: 2 }}>{app.applicant?.name}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{app.applicant?.email}</p>
                      </div>
                      <span className={`badge ${statusColor[app.status]}`} style={{ marginLeft: 'auto' }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    {app.applicant?.skills?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        {app.applicant.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                      </div>
                    )}

                    {app.applicant?.bio && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{app.applicant.bio}</p>}

                    {app.coverLetter && (
                      <details style={{ marginBottom: 12 }}>
                        <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Read Cover Letter</summary>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                      </details>
                    )}

                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ marginBottom: 12 }}>
                        📄 View Resume
                      </a>
                    )}

                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Update Status</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => updateStatus(app._id, s)}
                        className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-outline'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <input
                      type="text" className="form-input" placeholder="Add a note for the applicant (optional)..."
                      value={notes[app._id] || app.employerNote || ''}
                      onChange={e => setNotes({ ...notes, [app._id]: e.target.value })}
                      style={{ fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
