const db = require('../config/db');
const { performance } = require('perf_hooks');

async function analyzeQuery(sqlString) {

  const warnings = [];
  const suggestions = [];

  const upperQuery = sqlString.toUpperCase();

  // Rule 1
  if (upperQuery.includes('SELECT *')) {
    warnings.push("Avoid SELECT * in production queries");
    suggestions.push("Specify only the columns you need");
  }

  // Rule 2
  if (upperQuery.includes('WHERE')) {
    suggestions.push("Consider adding indexes on filtered columns");
  }

  // Rule 3
  if (upperQuery.includes('ORDER BY')) {
    suggestions.push("Ensure indexed columns are used for sorting");
  }

  // Rule 4
  if (upperQuery.includes('JOIN')) {
    suggestions.push("Ensure join columns are indexed");
  }

  let executionTimeMs = 0;
  let slowQuery = false;

  try {

    const start = performance.now();

    await db.query(sqlString);

    const end = performance.now();

    executionTimeMs = Math.round(end - start);

    // Slow query detection
    if (executionTimeMs > 100) {
      slowQuery = true;
      warnings.push("Slow query detected");
      suggestions.push("Optimize query or add indexes");
    }

  } catch (err) {

    console.error("Execution analysis failed:", err.message);

    return {
      error: "Query execution failed",
      message: err.message
    };

  }

  return {

    query: sqlString,
    executionTime: `${executionTimeMs} ms`,
    slowQuery,
    warnings,
    suggestions

  };

}

module.exports = {
  analyzeQuery
};