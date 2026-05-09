const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['jobseeker', 'employer'], required: true },
  // Job Seeker fields
  resume: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  bio: { type: String },
  location: { type: String },
  phone: { type: String },
  // Employer fields
  companyName: { type: String },
  companyWebsite: { type: String },
  companyDescription: { type: String },
  industry: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
