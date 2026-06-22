const productService = require(
    "../services/product.service"
);

async function getProducts(
    req,
    res,
    next
) {
    try {
        const result =
            await productService.getProducts({
                category:
                    req.query.category ||
                    null,

                limit:
                    req.query.limit,

                cursor:
                    req.query.cursor ||
                    null,
            });

        return res.status(200).json(
            result
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
};