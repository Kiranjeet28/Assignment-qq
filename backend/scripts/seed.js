require("dotenv").config();
const { faker } = require("@faker-js/faker");
const pool = require("../src/config/db");

const TOTAL_RECORDS = 200000;
const COLUMN_COUNT = 4;
const PG_PARAMETER_LIMIT = 65535;
const BATCH_SIZE = 10000;

const categories = ["electronics", "clothing", "books", "sports", "beauty", "toys", "home", "grocery"];

async function validateEnvironment() {
    console.log("Running pre-seed checks...");

    try {
        await pool.query("SELECT 1");
    } catch (error) {
        throw new Error("Database connection failed");
    }

    // PostgreSQL parameter protection validation
    const totalParams = COLUMN_COUNT * BATCH_SIZE;
    if (totalParams > PG_PARAMETER_LIMIT) {
        throw new Error(`PostgreSQL parameter limit exceeded: ${totalParams}`);
    }

    console.log("All pre-seed checks passed");
}

function checkMemoryUsage() {
    const memoryMB = process.memoryUsage().heapUsed / 1024 / 1024;
    if (memoryMB > 512) {
        throw new Error(`Memory usage exceeded limit: ${memoryMB.toFixed(2)} MB`);
    }
}

function generateBatch(batchSize) {
    const rows = [];
    for (let i = 0; i < batchSize; i++) {
        rows.push([
            faker.commerce.productName(),
            faker.helpers.arrayElement(categories),
            Number(faker.commerce.price({ min: 10, max: 1000 })),
            faker.date.recent({ days: 365 }),
        ]);
    }
    return rows;
}

async function insertBatch(client, rows) {
    if (rows.length === 0) throw new Error("Empty batch detected");

    const values = [];
    const placeholders = [];

    for (let i = 0; i < rows.length; i++) {
        const base = i * COLUMN_COUNT;
        placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
        values.push(...rows[i]);
    }

    const query = `
    INSERT INTO products (name, category, price, created_at)
    VALUES ${placeholders.join(",")}
  `;

    await client.query(query, values);
}

async function seed() {
    console.time("Seed Completed");
    await validateEnvironment();

    const client = await pool.connect();

    try {
        // FIXED: Clean the table before beginning the loop safely 
        console.log("🧹 Clearing old data...");
        await client.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE");

        let inserted = 0;

        while (inserted < TOTAL_RECORDS) {
            const currentBatch = Math.min(BATCH_SIZE, TOTAL_RECORDS - inserted);

            checkMemoryUsage();
            const rows = generateBatch(currentBatch);

            // FIXED: Each batch runs as its own self-contained micro-transaction statement now
            await insertBatch(client, rows);

            inserted += currentBatch;
            rows.length = 0; // Clear array elements explicitly for garbage collection

            console.log(`Inserted ${inserted.toLocaleString()} / ${TOTAL_RECORDS.toLocaleString()}`);
        }

        // Final Verification
        const verifyResult = await pool.query("SELECT COUNT(*) AS count FROM products");
        const finalCount = Number(verifyResult.rows[0].count);

        if (finalCount !== TOTAL_RECORDS) {
            throw new Error(`Expected ${TOTAL_RECORDS} rows, found ${finalCount}`);
        }

        console.log("✅ Seed verification passed perfectly!");
        console.timeEnd("Seed Completed");
    } catch (error) {
        console.error("❌ Seed execution process failed:", error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();