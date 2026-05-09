import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Operations'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`).then(res => {
      const j = res.data;
      setForm({
        title: j.title, description: j.description, requirements: j.requirements || '',
        responsibilities: j.responsibilities || '', location: j.location, type: j.type,
        category: j.category, salaryMin: j.salaryMin || '', salaryMax: j.salaryMax || '',
        skills: (j.skills || []).join(', '), experienceLevel: j.experienceLevel || 'Mid',
        applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : ''
      });
    });
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      await axios.put(`/api/jobs/${id}`, payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page post-job-page">
      <div className="container">
        <div className="post-job-header">
          <h1>Edit Job Posting</h1>
        </div>
        <div className="card post-job-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" name="location" className="form-input" value={form.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Min Salary ($)</label>
                  <input type="number" name="salaryMin" className="form-input" value={form.salaryMin} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Salary ($)</label>
                  <input type="number" name="salaryMax" className="form-input" value={form.salaryMax} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Job Details</h3>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-textarea" rows={6} value={form.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Responsibilities</label>
                <textarea name="responsibilities" className="form-textarea" rows={4} value={form.responsibilities} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea name="requirements" className="form-textarea" rows={4} value={form.requirements} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input type="text" name="skills" className="form-input" value={form.skills} onChange={handleChange} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
