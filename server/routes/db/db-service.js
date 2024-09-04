const mysql = require("mysql2/promise");

class DBService {
  constructor(config) {
    // signltone pattern
    if (DBService.instance) {
      return DBService.instance;
    }
    this.instance = this;
    this.pool = mysql.createPool(config);
  }

  async connect() {
    try {
      const connection = await this.pool.getConnection();
      console.log("Connected to the database");
      connection.release();
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  }

  inferColumnType(value) {
    if (typeof value === "number") {
      return "INT";
    } else if (typeof value === "string") {
      return "VARCHAR(255)";
    } else if (typeof value === "boolean") {
      return "BOOLEAN";
    } else {
      throw new Error(`Unsupported data type: ${typeof value}`);
    }
  }

  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      );
    `;

    try {
      const [result] = await this.pool.execute(sql);
      console.log("Table created or already exists:", result);
    } catch (err) {
      console.error("Error creating table:", err);
      throw err;
    }
  }

  async create(table, data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(", ");

    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    try {
      const [result] = await this.pool.execute(sql, values);
      return result;
    } catch (err) {
      console.error("Error creating record:", err);
      throw err;
    }
  }

  async update(table, data, where) {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const whereValues = Object.values(where);

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

    try {
      const [result] = await this.pool.execute(sql, [
        ...values,
        ...whereValues,
      ]);
      return result;
    } catch (err) {
      console.error("Error updating record:", err);
      throw err;
    }
  }

  async delete(table, where) {
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const whereValues = Object.values(where);

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

    try {
      const [result] = await this.pool.execute(sql, whereValues);
      return result;
    } catch (err) {
      console.error("Error deleting record:", err);
      throw err;
    }
  }
}

module.exports = DBService;
