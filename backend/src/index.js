require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route (added so Render URL works)
app.get('/', (req, res) => {
    res.send('SQL Query Performance Analyzer API is running 🚀');
});

// Routes
const queryRoutes = require('./routes/query.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/api/queries', queryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SQL Performance Analyzer API is running'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});