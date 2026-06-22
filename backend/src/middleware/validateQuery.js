const {
    DEFAULT_LIMIT,
    MAX_LIMIT,
} = require("../constants/pagination");

module.exports = (req, res, next) => {
    const limit = Number(
        req.query.limit || DEFAULT_LIMIT
    );

    if (
        Number.isNaN(limit) ||
        limit < 1 ||
        limit > MAX_LIMIT
    ) {
        return res.status(400).json({
            error: "limit must be between 1 and 100",
        });
    }

    req.query.limit = limit;

    next();
};