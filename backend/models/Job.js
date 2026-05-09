const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements: { type: String },
  responsibilities: { type: String },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], required: true },
  category: { type: String, required: true },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  currency: { type: String, default: 'USD' },
  skills: [{ type: String }],
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'] },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  applicationDeadline: { type: Date },
  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
