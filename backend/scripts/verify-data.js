require("dotenv").config();

const pool = require("../src/config/db");

async function verify() {
    try {
        const count = await pool.query(`
      SELECT COUNT(*) AS count
      FROM products
    `);

        const categories =
            await pool.query(`
        SELECT
          category,
          COUNT(*) AS total
        FROM products
        GROUP BY category
        ORDER BY total DESC
      `);

        console.log(
            "Total Products:",
            count.rows[0].count
        );

        console.table(
            categories.rows
        );
    } finally {
        await pool.end();
    }
}

verify();