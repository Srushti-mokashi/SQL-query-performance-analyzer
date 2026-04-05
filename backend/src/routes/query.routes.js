const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');

router.post('/execute', queryController.executeQuery);
router.get('/history', queryController.getHistory);

module.exports = router;
