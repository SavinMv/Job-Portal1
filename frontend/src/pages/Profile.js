import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      const u = res.data;
      setForm({
        name: u.name || '', phone: u.phone || '', location: u.location || '', bio: u.bio || '',
        // Jobseeker
        skills: (u.skills || []).join(', '), experience: u.experience || '', education: u.education || '', resume: u.resume || '',
        // Employer
        companyName: u.companyName || '', companyWebsite: u.companyWebsite || '',
        companyDescription: u.companyDescription || '', industry: u.industry || ''
      });
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await axios.put('/api/profile', payload);
      setSuccess('Profile updated successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Keep your profile updated to stand out</p>

        <div className="card">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Personal Info</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" name="phone" className="form-input" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" name="location" className="form-input" placeholder="City, Country" value={form.location} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea name="bio" className="form-textarea" rows={3} placeholder="Tell employers about yourself..." value={form.bio} onChange={handleChange} />
              </div>
            </div>

            {authUser?.role === 'jobseeker' ? (
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Professional Info</h3>
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input type="text" name="skills" className="form-input" placeholder="React, Node.js, Python..." value={form.skills} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <textarea name="experience" className="form-textarea" rows={3} placeholder="Your work experience..." value={form.experience} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Education</label>
                  <textarea name="education" className="form-textarea" rows={2} placeholder="Degrees, certifications..." value={form.education} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume URL</label>
                  <input type="url" name="resume" className="form-input" placeholder="Link to your resume" value={form.resume} onChange={handleChange} />
                </div>
              </div>
            ) : (
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Company Info</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" name="companyName" className="form-input" value={form.companyName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input type="text" name="industry" className="form-input" placeholder="e.g. Technology" value={form.industry} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input type="url" name="companyWebsite" className="form-input" placeholder="https://..." value={form.companyWebsite} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Description</label>
                  <textarea name="companyDescription" className="form-textarea" rows={4} placeholder="Tell candidates about your company..." value={form.companyDescription} onChange={handleChange} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
