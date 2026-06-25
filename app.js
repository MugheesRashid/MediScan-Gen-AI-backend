const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyze.route');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
};

// Middleware - set limits to 10mb for large base64 image uploads
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Analyze routes registered under both /api and / to be flexible
app.use('/api', analyzeRoutes);
app.use('/', analyzeRoutes);

module.exports = app;