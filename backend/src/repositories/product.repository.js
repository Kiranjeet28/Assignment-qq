const pool = require("../config/db");

async function findProducts({
  category,
  limit,
  cursorCreatedAt,
  cursorId,
}) {
  const values = [];
  let paramIndex = 1;

  let query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at
    FROM products
    WHERE TRUE
  `;

  if (category) {
    query += `
      AND category = $${paramIndex}
    `;

    values.push(category);

    paramIndex++;
  }

  if (
    cursorCreatedAt !== null &&
    cursorId !== null
  ) {
    query += `
      AND (created_at, id)
      < ($${paramIndex}, $${paramIndex + 1})
    `;

    values.push(
      cursorCreatedAt
    );

    values.push(cursorId);

    paramIndex += 2;
  }

  query += `
    ORDER BY
      created_at DESC,
      id DESC
    LIMIT $${paramIndex}
  `;

  values.push(limit);

  try {
    const { rows } =
      await pool.query(
        query,
        values
      );

    return rows;
  } catch (error) {
    console.error(
      "Repository Error:"
    );

    console.error(error);

    console.error(
      "Query:",
      query
    );

    console.error(
      "Values:",
      values
    );

    throw error;
  }
}

module.exports = {
  findProducts,
};