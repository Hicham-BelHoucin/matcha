// src/Database.ts
import { Pool } from "pg";
import fs from "fs";
import path from "path";

export class Database {
  private static pool: Pool;

  // Initialize the database connection
  static async initialize() {
    if (!Database.pool) {
      Database.pool = new Pool({
        user: process.env.POSTGRES_USER || "your_db_user",
        password: process.env.POSTGRES_PASSWORD || "your_db_password",
        database: process.env.POSTGRES_DB || "your_db_name",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
      });

      console.log("Database connected");
    }
  }

  // Apply migrations
  static async applyMigrations() {
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationsDir);

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = fs.readFileSync(migrationPath, "utf-8");

      try {
        await Database.query(migration);
        console.log(`Applied migration: ${file}`);
      } catch (err) {
        console.error(`Failed to apply migration: ${file}`, err);
      }
    }
  }

  // Execute a query
  static async query(queryText: string, params?: any[]) {
    await Database.initialize(); // Ensure the database is connected
    const client = await Database.pool.connect();

    try {
      const result = await client.query(queryText, params);
      // console.log("Query executed successfully", result);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Close the database connection
  static async close() {
    if (Database.pool) {
      await Database.pool.end();
      console.log("Database connection closed");
    }
  }
}
