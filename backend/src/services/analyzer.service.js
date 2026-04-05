const db = require('../config/db');

async function analyzeQuery(sqlString) {
  if (!sqlString.toLowerCase().trim().startsWith('select')) {
    return null;
  }
  
  try {
    const [explainResult] = await db.query(`EXPLAIN ${sqlString}`);
    const mainPlan = explainResult[0];
    
    // Check for full table scan
    if (mainPlan.type === 'ALL' && mainPlan.possible_keys === null) {
      return `Optimization Tip: Full table scan detected on table '${mainPlan.table}'. Consider adding an INDEX to the columns used in your WHERE clause.`;
    }
    return "Query execution plan looks optimal.";
  } catch (err) {
    console.error("EXPLAIN analysis failed:", err.message);
    return null; // Handle syntax errors gracefully
  }
}

module.exports = {
    analyzeQuery
};
