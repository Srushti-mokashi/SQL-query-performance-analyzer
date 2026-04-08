const db = require('../config/db');
const analyzerService = require('../services/analyzer.service');

exports.analyzeQuery = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const analysis = await analyzerService.analyzeQuery(query);

        if (analysis && analysis.error) {
            return res.status(400).json(analysis);
        }

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error("Analyze Query Error:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


exports.getStats = async (req, res) => {
    try {

        const statsQuery = `
            SELECT 
                COUNT(*) AS total_queries,
                COUNT(*) FILTER (WHERE is_slow = true) AS slow_queries,
                COUNT(*) FILTER (WHERE status = 'ERROR') AS error_queries,
                AVG(execution_time_ms) AS avg_execution_time
            FROM query_logs
        `;

        const timeseriesQuery = `
            SELECT 
                id,
                executed_at,
                execution_time_ms,
                is_slow
            FROM query_logs
            ORDER BY executed_at DESC
            LIMIT 50
        `;

        const statsResult = await db.query(statsQuery);
        const timeseriesResult = await db.query(timeseriesQuery);

        const stats = statsResult.rows[0];

        res.json({
            success: true,
            data: {
                totalQueries: parseInt(stats.total_queries || 0),
                slowQueries: parseInt(stats.slow_queries || 0),
                errorQueries: parseInt(stats.error_queries || 0),
                avgExecutionTime: parseFloat(stats.avg_execution_time || 0).toFixed(2),
                timeseries: timeseriesResult.rows.reverse()
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};