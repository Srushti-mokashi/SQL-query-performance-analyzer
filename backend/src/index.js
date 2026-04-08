require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================

// Allow frontend requests
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://sql-query-performance-analyzer.vercel.app" // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// ======================
// Root Route
// ======================

app.get("/", (req, res) => {
  res.send(`
    <h2>SQL Query Performance Analyzer API</h2>
    <p>Available Endpoints:</p>
    <ul>
      <li><b>GET /api/health</b> → Check API status</li>
      <li><b>POST /api/analyze</b> → Analyze SQL query performance</li>
      <li><b>GET /api/queries</b> → View stored query metrics</li>
    </ul>
    <p>Use Postman or the frontend UI to interact with the API.</p>
  `);
});

// ======================
// Routes
// ======================

const queryRoutes = require("./routes/query.routes");
const analyticsRoutes = require("./routes/analytics.routes");

app.use("/api/queries", queryRoutes);
app.use("/api/analytics", analyticsRoutes);

// ======================
// Health Check
// ======================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SQL Performance Analyzer API is running",
    timestamp: new Date()
  });
});

// ======================
// Global Error Handler
// ======================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal Server Error"
  });
});

// ======================
// Start Server
// ======================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});