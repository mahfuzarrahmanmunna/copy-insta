// src/lib/dbConnect.js
// CHANGED: Use { createPool } instead of default import
import { createPool } from "mariadb";

// Cache the connection pool globally to avoid creating multiple pools on hot reloads
let pool = null;

export async function dbConnect() {
  // If pool already exists, return it
  if (pool) {
    return pool;
  }

  try {
    // Create the connection pool configuration
    const poolConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      connectionLimit: 5,
    };

    // CHANGED: Call createPool directly
    pool = createPool(poolConfig);

    // Optional: Test connection immediately to ensure credentials are correct
    const conn = await pool.getConnection();
    conn.release(); // Release the connection back to the pool

    console.log("Connected to MariaDB successfully");

    return pool;
  } catch (error) {
    console.error("Error connecting to MariaDB:", error);
    throw new Error("Failed to connect to the database");
  }
}
