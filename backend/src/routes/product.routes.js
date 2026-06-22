const express = require("express");

const router = express.Router();

const {
    getProducts,
} = require("../controllers/product.controller");

const validateQuery = require(
    "../middleware/validateQuery"
);

router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "product-catalog-api",
    });
});

router.get(
    "/products",
    validateQuery,
    getProducts
);

module.exports = router;