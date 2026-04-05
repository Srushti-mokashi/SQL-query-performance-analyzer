const db = require('../config/db');
const analyzerService = require('../services/analyzer.service');

exports.analyzeQuery = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }
        
        const analysis = await analyzerService.analyzeQuery(query);
        
        res.json({
            success: true,
            data: {
                query: query,
                analysis: analysis || 'No analysis available'
            }
        });
    } catch (error) {
        console.error("Analyze Query Error:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const queries = `
            SELECT 
                COUNT(*) as totalQueries,
                SUM(CASE WHEN is_slow = 1 THEN 1 ELSE 0 END) as slowQueries,
                SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as errorQueries,
                AVG(execution_time_ms) as avgExecutionTime
            FROM query_logs;
        `;
        
        const recentPerformanceQueries = `
            SELECT id, executed_at, execution_time_ms, is_slow
            FROM query_logs
            WHERE status = 'SUCCESS'
            ORDER BY executed_at DESC
            LIMIT 50;
        `;

        const [[statsRows], [timeseriesRows]] = await Promise.all([
            db.query(queries),
            db.query(recentPerformanceQueries)
        ]);

        const stats = statsRows[0];
        
        res.json({
            success: true,
            data: {
                totalQueries: stats.totalQueries || 0,
                slowQueries: parseInt(stats.slowQueries || 0),
                errorQueries: parseInt(stats.errorQueries || 0),
                avgExecutionTime: parseFloat(stats.avgExecutionTime || 0).toFixed(2),
                timeseries: timeseriesRows.reverse() // Oldest to newest for frontend charts
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
