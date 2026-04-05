const executionService = require('../services/execution.service');

exports.executeQuery = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }
        
        const result = await executionService.executeAndLogQuery(query);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Execute Query Error:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const history = await executionService.getQueryHistory(page || 1, limit || 20);
        res.json({ success: true, ...history });
    } catch (error) {
        console.error("Get History Error:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
