const db = require("../config/db");
const { performance } = require("perf_hooks");

const SLOW_QUERY_THRESHOLD = 1000;

async function executeAndLogQuery(sqlString) {

    const start = performance.now();

    let rows = [];
    let status = "SUCCESS";
    let errorMessage = null;

    try {

        const result = await db.query(sqlString);
        rows = result.rows;

    } catch (error) {

        status = "ERROR";
        errorMessage = error.message;

    }

    const end = performance.now();

    const executionTime = Math.round(end - start);

    const isSlow = executionTime > SLOW_QUERY_THRESHOLD;

    try {

        await db.query(
            `INSERT INTO query_logs 
      (query_text, execution_time_ms, status, error_message, is_slow, executed_at)
      VALUES ($1,$2,$3,$4,$5,NOW())`,
            [
                sqlString,
                executionTime,
                status,
                errorMessage,
                isSlow
            ]
        );

    } catch (err) {
        console.error("Logging failed:", err.message);
    }

    return {
        success: status === "SUCCESS",
        data: rows,
        metrics: {
            executionTime,
            isSlow
        },
        error: errorMessage
    };
}

async function getQueryHistory(page = 1, limit = 10) {

    const offset = (page - 1) * limit;

    const logs = await db.query(
        `SELECT *
     FROM query_logs
     ORDER BY executed_at DESC
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const total = await db.query(`SELECT COUNT(*) FROM query_logs`);

    return {
        logs: logs.rows,
        total: parseInt(total.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
    };
}

module.exports = {
    executeAndLogQuery,
    getQueryHistory
};