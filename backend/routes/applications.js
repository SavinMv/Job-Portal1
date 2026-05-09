const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, employerOnly, jobseekerOnly } = require('../middleware/auth');

// @POST /api/applications/:jobId - Apply for a job
router.post('/:jobId', protect, jobseekerOnly, async (req, res) => {
  try {
    const { coverLetter, resumeUrl } = req.body;
    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter,
      resumeUrl
    });

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationsCount: 1 } });
    await application.populate('job', 'title company location type');
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/applications/my - Get jobseeker's applications
router.get('/my/applications', protect, jobseekerOnly, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salaryMin salaryMax employer')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/applications/job/:jobId - Get applicants for a job (employer)
router.get('/job/:jobId', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience education bio phone location resume')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/applications/:id/status - Update application status (employer)
router.put('/:id/status', protect, employerOnly, async (req, res) => {
  try {
    const { status, employerNote } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    application.status = status;
    if (employerNote) application.employerNote = employerNote;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
