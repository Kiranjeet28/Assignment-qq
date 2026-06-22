function encodeCursor(
    createdAt,
    id
) {
    return Buffer.from(
        JSON.stringify({
            createdAt,
            id: Number(id),
        })
    ).toString("base64url");
}

function decodeCursor(
    cursor
) {
    const decoded = JSON.parse(
        Buffer.from(
            cursor,
            "base64url"
        ).toString("utf8")
    );

    return {
        createdAt:
            decoded.createdAt,
        id: Number(decoded.id),
    };
}

module.exports = {
    encodeCursor,
    decodeCursor,
};