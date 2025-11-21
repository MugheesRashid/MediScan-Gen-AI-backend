const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload.route');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://medicare-genai.vercel.app/',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Upload routes
app.use('/api/upload', uploadRoutes);

module.exports = app;