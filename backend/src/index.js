require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const queryRoutes = require('./routes/query.routes');
const analyticsRoutes = require('./routes/analytics.routes');
app.use('/api/queries', queryRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SQL Performance Analyzer API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
