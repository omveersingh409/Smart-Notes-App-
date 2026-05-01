require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const noteRoutes = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://studynotion56_db_user:ypCCDEc3yEMwwcSd@cluster0.hrmohgq.mongodb.net/smartnotes';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));

// --- ROUTES ---
app.use('/api/notes', noteRoutes);

// --- SERVE FRONTEND (For Production) ---
const path = require('path');
if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL) {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Anything that doesn't match the API routes should be routed to the React app
  app.get('/(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
