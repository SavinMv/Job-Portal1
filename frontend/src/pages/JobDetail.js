import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm] = useState({ coverLetter: '', resumeUrl: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then(res => { setJob(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/jobs'); });
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      await axios.post(`/api/applications/${id}`, applyForm);
      setApplied(true);
      setShowApplyForm(false);
      setSuccess('Application submitted successfully! 🎉');
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!job) return null;

  const salary = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
    : job.salaryMin ? `From $${job.salaryMin.toLocaleString()}` : 'Not specified';

  return (
    <div className="page job-detail-page">
      <div className="container job-detail-container">
        {/* Main Content */}
        <div className="job-detail-main">
          <div className="card job-detail-header-card">
            <div className="jd-header">
              <div className="jd-company-logo">{job.company?.charAt(0)}</div>
              <div className="jd-info">
                <h1>{job.title}</h1>
                <p className="jd-company">{job.company}</p>
                <div className="jd-tags">
                  <span className="badge badge-blue">{job.type}</span>
                  {job.experienceLevel && <span className="badge badge-gray">{job.experienceLevel} Level</span>}
                  {job.category && <span className="badge badge-purple">{job.category}</span>}
                </div>
              </div>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            {user?.role === 'jobseeker' && !applied && !showApplyForm && (
              <button className="btn btn-primary btn-lg" onClick={() => {
                if (!user) navigate('/login');
                else setShowApplyForm(true);
              }}>
                Apply Now →
              </button>
            )}

            {showApplyForm && (
              <form className="apply-form" onSubmit={handleApply}>
                <h3>Submit Application</h3>
                <div className="form-group">
                  <label className="form-label">Cover Letter</label>
                  <textarea className="form-textarea" placeholder="Tell us why you're a great fit..." rows={5}
                    value={applyForm.coverLetter} onChange={e => setApplyForm({ ...applyForm, coverLetter: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume URL (optional)</label>
                  <input type="url" className="form-input" placeholder="https://your-resume-link.com"
                    value={applyForm.resumeUrl} onChange={e => setApplyForm({ ...applyForm, resumeUrl: e.target.value })} />
                </div>
                <div className="apply-actions">
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowApplyForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            {!user && (
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Login to Apply</button>
            )}
          </div>

          <div className="card">
            <h2 className="section-title">Job Description</h2>
            <div className="job-text">{job.description}</div>
            {job.responsibilities && (
              <>
                <h2 className="section-title">Responsibilities</h2>
                <div className="job-text">{job.responsibilities}</div>
              </>
            )}
            {job.requirements && (
              <>
                <h2 className="section-title">Requirements</h2>
                <div className="job-text">{job.requirements}</div>
              </>
            )}
            {job.skills?.length > 0 && (
              <>
                <h2 className="section-title">Required Skills</h2>
                <div className="skill-list">
                  {job.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="job-detail-sidebar">
          <div className="card sidebar-card">
            <h3>Job Overview</h3>
            <div className="overview-list">
              <div className="overview-item"><span>📍</span><div><strong>Location</strong><p>{job.location}</p></div></div>
              <div className="overview-item"><span>💼</span><div><strong>Job Type</strong><p>{job.type}</p></div></div>
              <div className="overview-item"><span>💰</span><div><strong>Salary</strong><p>{salary}</p></div></div>
              {job.experienceLevel && <div className="overview-item"><span>🎯</span><div><strong>Experience</strong><p>{job.experienceLevel} Level</p></div></div>}
              <div className="overview-item"><span>👥</span><div><strong>Applicants</strong><p>{job.applicationsCount || 0} applied</p></div></div>
              {job.applicationDeadline && <div className="overview-item"><span>📅</span><div><strong>Deadline</strong><p>{new Date(job.applicationDeadline).toLocaleDateString()}</p></div></div>}
            </div>
          </div>

          {job.employer && (
            <div className="card sidebar-card">
              <h3>About the Company</h3>
              <div className="company-info">
                <div className="company-logo-lg">{job.company?.charAt(0)}</div>
                <h4>{job.company}</h4>
                {job.employer.industry && <p className="industry">{job.employer.industry}</p>}
                {job.employer.companyDescription && <p className="company-desc">{job.employer.companyDescription}</p>}
                {job.employer.companyWebsite && (
                  <a href={job.employer.companyWebsite} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm company-link">Visit Website →</a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default JobDetail;
