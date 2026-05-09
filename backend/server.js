const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log('Starting server...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found ✅' : 'Missing ❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found ✅' : 'Missing ❌');
console.log('PORT:', process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/profile', require('./routes/profile'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal')
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;