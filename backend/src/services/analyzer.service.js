const db = require('../config/db');
const { performance } = require('perf_hooks');

async function analyzeQuery(sqlString) {
  const warnings = [];
  const suggestions = [];
  
  const upperQuery = sqlString.toUpperCase();

  if (upperQuery.includes('SELECT *')) {
    warnings.push("Avoid SELECT * in production queries");
    suggestions.push("Specify only the columns you need");
  }

  if (upperQuery.includes('WHERE')) {
    suggestions.push("Consider adding indexes on filtered columns");
  }

  if (upperQuery.includes('ORDER BY')) {
    suggestions.push("Ensure indexed columns are used for sorting");
  }

  if (upperQuery.includes('JOIN')) {
    suggestions.push("Ensure join columns are indexed");
  }

  let executionTimeMs = 0;
  try {
    const start = performance.now();
    await db.query(sqlString);
    const end = performance.now();
    executionTimeMs = Math.round(end - start);
  } catch (err) {
    console.error("Execution analysis failed:", err.message);
  }

  return {
    executionTime: `${executionTimeMs} ms`,
    warnings,
    suggestions
  };
}

module.exports = {
    analyzeQuery
};
