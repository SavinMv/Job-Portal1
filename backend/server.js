const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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
    app.listen(process.env.PORT || 10000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 10000}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));

module.exports = app;
