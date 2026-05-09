const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, employerOnly } = require('../middleware/auth');

// @GET /api/jobs - Get all jobs (public, with filters)
router.get('/', async (req, res) => {
  try {
    const { search, category, type, location, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name companyName companyWebsite industry')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name companyName companyWebsite industry companyDescription');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/jobs - Create job (employer only)
router.post('/', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id, company: req.user.companyName || req.body.company });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/jobs/:id - Update job
router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/jobs/:id - Delete job
router.delete('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/jobs/employer/myjobs - Get employer's own jobs
router.get('/employer/myjobs', protect, employerOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
