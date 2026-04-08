const express = require("express");
const router = express.Router();

const executionController = require("../controllers/execution.controller");

// Run query + log performance
router.post("/analyze", executionController.executeQuery);

// Get query history
router.get("/", executionController.getHistory);

module.exports = router;