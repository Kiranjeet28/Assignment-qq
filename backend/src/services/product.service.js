const repository = require(
    "../repositories/product.repository"
);

const {
    encodeCursor,
    decodeCursor,
} = require("../utils/cursor");

async function getProducts({
    category,
    limit,
    cursor,
}) {
    const numericLimit =
        Number(limit) || 20;
    if (Number.isNaN(numericLimit)) {
        throw new Error("Invalid limit");
    }
    let cursorCreatedAt = null;
    let cursorId = null;

    if (cursor) {
        const decoded =
            decodeCursor(cursor);

        if (
            !decoded.createdAt ||
            decoded.id === undefined
        ) {
            throw new Error(
                "Invalid cursor"
            );
        }

        cursorCreatedAt =
            decoded.createdAt;
        cursorId = Number(decoded.id);

        if (Number.isNaN(cursorId)) {
            throw new Error(
                "Invalid cursor id"
            );
        }

        if (
            Number.isNaN(cursorId)
        ) {
            throw new Error(
                "Invalid cursor id"
            );
        }
    }

    const rows =
        await repository.findProducts({
            category,
            limit:
                numericLimit + 1,
            cursorCreatedAt,
            cursorId,
        });

    const hasNextPage =
        rows.length >
        numericLimit;

    const products =
        hasNextPage
            ? rows.slice(
                0,
                numericLimit
            )
            : rows;

    let nextCursor = null;

    if (
        hasNextPage &&
        products.length > 0
    ) {
        const last =
            products[
            products.length - 1
            ];

        nextCursor =
            encodeCursor(
                last.created_at,
                last.id
            );
    }

    return {
        products,
        nextCursor,
        hasNextPage,
    };
}

module.exports = {
    getProducts,
};