const db = require('../config/db');
const { performance } = require('perf_hooks');
const analyzerService = require('./analyzer.service');

const SLOW_QUERY_THRESHOLD = 2000; // 2 seconds

// Background logging function
async function logExecution(queryText, timeMs, status, errorMsg, isSlow, suggestion) {
    try {
        const sql = `INSERT INTO query_logs 
          (query_text, execution_time_ms, status, error_message, is_slow, optimization_suggestion) 
          VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [queryText, timeMs, status, errorMsg, isSlow, suggestion]);
    } catch (err) {
        console.error("Failed to log query execution:", err.message);
    }
}

async function executeAndLogQuery(sqlString) {
    const start = performance.now();
    let rows = [];
    let isSuccess = true;
    let errorMessage = null;
    let suggestion = null;
    
    try {
        [rows] = await db.query(sqlString);
        const analysisResult = await analyzerService.analyzeQuery(sqlString);
        suggestion = analysisResult && analysisResult.suggestions.length > 0 
            ? analysisResult.suggestions.join('; ') 
            : "Query execution plan looks optimal.";
    } catch (error) {
        isSuccess = false;
        errorMessage = error.message;
    }
    
    const end = performance.now();
    const executionTimeMs = (end - start).toFixed(2);
    const isSlow = executionTimeMs > SLOW_QUERY_THRESHOLD;

    // Async log the query to database
    logExecution(sqlString, executionTimeMs, isSuccess ? 'SUCCESS' : 'ERROR', errorMessage, isSlow, suggestion);

    return {
        success: isSuccess,
        data: isSuccess ? rows : null,
        error: errorMessage,
        metrics: {
            executionTimeMs: parseFloat(executionTimeMs),
            isSlow,
            suggestion
        }
    };
}

async function getQueryHistory(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
        'SELECT * FROM query_logs ORDER BY executed_at DESC LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
    );
    // Get total count for pagination
    const [totalRows] = await db.query('SELECT COUNT(*) as count FROM query_logs');
    
    return {
        logs: rows,
        total: totalRows[0].count,
        page: parseInt(page),
        limit: parseInt(limit)
    };
}

module.exports = {
    executeAndLogQuery,
    getQueryHistory
};
