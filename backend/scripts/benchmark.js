require("dotenv").config();

const pool = require("../src/config/db");

async function benchmark() {
    const result =
        await pool.query(`
      EXPLAIN ANALYZE
      SELECT
        id,
        name,
        category,
        price,
        created_at
      FROM products
      WHERE category = 'electronics'
      ORDER BY
        created_at DESC,
        id DESC
      LIMIT 20
    `);

    console.log(
        result.rows
            .map(
                row => row["QUERY PLAN"]
            )
            .join("\n")
    );

    await pool.end();
}

benchmark();