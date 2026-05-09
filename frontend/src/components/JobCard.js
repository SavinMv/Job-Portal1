import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const typeColors = {
  'Full-time': 'badge-blue',
  'Part-time': 'badge-orange',
  'Contract': 'badge-purple',
  'Internship': 'badge-green',
  'Remote': 'badge-green',
};

const JobCard = ({ job }) => {
  const salary = job.salaryMin && job.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
    : job.salaryMin ? `From $${(job.salaryMin / 1000).toFixed(0)}k` : null;

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / 86400000);
  const posted = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

  return (
    <Link to={`/jobs/${job._id}`} className="job-card card">
      <div className="job-card-header">
        <div className="company-logo">{job.company?.charAt(0)}</div>
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span className={`badge ${typeColors[job.type] || 'badge-gray'} job-type-badge`}>{job.type}</span>
      </div>

      <div className="job-meta">
        <span className="meta-item">📍 {job.location}</span>
        {salary && <span className="meta-item">💰 {salary}</span>}
        {job.experienceLevel && <span className="meta-item">🎯 {job.experienceLevel}</span>}
      </div>

      {job.skills?.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 4).map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="skill-tag more">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="job-footer">
        <span className="job-date">{posted}</span>
        {job.applicationsCount > 0 && (
          <span className="applicant-count">{job.applicationsCount} applicants</span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
