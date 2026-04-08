const executionService = require('../services/execution.service');

exports.executeQuery = async (req, res) => {
    try {

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: "Query is required"
            });
        }

        const result = await executionService.executeAndLogQuery(query);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Execute Query Error:", error);

        res.status(500).json({
            success: false,
            error: "Internal server error"
        });

    }
};

exports.getHistory = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const history = await executionService.getQueryHistory(page, limit);

        res.json(history);

    } catch (error) {

        console.error("History Error:", error);

        res.status(500).json({
            success: false,
            error: "Internal server error"
        });

    }
};