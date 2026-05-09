import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostJob.css';

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Operations'];

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', responsibilities: '',
    location: '', type: 'Full-time', category: 'Technology',
    salaryMin: '', salaryMax: '', skills: '', experienceLevel: 'Mid', applicationDeadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      await axios.post('/api/jobs', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page post-job-page">
      <div className="container">
        <div className="post-job-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to attract the best candidates</p>
        </div>

        <div className="card post-job-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" name="title" className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" name="location" className="form-input" placeholder="e.g. New York, NY or Remote" value={form.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select name="experienceLevel" className="form-select" value={form.experienceLevel} onChange={handleChange}>
                    {['Entry', 'Mid', 'Senior', 'Lead', 'Executive'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input type="date" name="applicationDeadline" className="form-input" value={form.applicationDeadline} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Compensation</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Minimum Salary ($)</label>
                  <input type="number" name="salaryMin" className="form-input" placeholder="e.g. 60000" value={form.salaryMin} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Salary ($)</label>
                  <input type="number" name="salaryMax" className="form-input" placeholder="e.g. 90000" value={form.salaryMax} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Job Details</h3>
              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea name="description" className="form-textarea" rows={6} placeholder="Describe the role, team, and what makes this opportunity exciting..." value={form.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Responsibilities</label>
                <textarea name="responsibilities" className="form-textarea" rows={4} placeholder="Key responsibilities and day-to-day tasks..." value={form.responsibilities} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea name="requirements" className="form-textarea" rows={4} placeholder="Qualifications, certifications, and must-haves..." value={form.requirements} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Required Skills (comma-separated)</label>
                <input type="text" name="skills" className="form-input" placeholder="e.g. React, Node.js, MongoDB, AWS" value={form.skills} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
              <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
