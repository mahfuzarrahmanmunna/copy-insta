import { createPool } from "mariadb";

// Cache the connection pool globally to avoid creating multiple pools
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
      // INCREASED: 10 is safer for production to handle concurrent requests
      connectionLimit: 10,
      // ADDED: Reconnect automatically if connection is lost
      acquireTimeout: 10000, // 10 seconds
      // ADDED: Idle connections timeout (release them back to pool)
      idleTimeout: 60000, // 1 minute
    };

    pool = createPool(poolConfig);

    // Test connection immediately
    const conn = await pool.getConnection();
    console.log("Connected to MariaDB successfully (Pool created)");
    conn.release();

    return pool;
  } catch (error) {
    console.error("Error connecting to MariaDB:", error);
    // In production, we might want to throw a more specific error or handle retry logic
    throw new Error("Failed to connect to the database");
  }
}
