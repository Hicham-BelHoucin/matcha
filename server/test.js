const mysql = require("mysql2/promise");

class DBService {
  constructor(config) {
    if (DBService.instance) {
      return DBService.instance;
    }
    DBService.instance = this;
    this.pool = mysql.createPool(config);
    this.tables = new Map();
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

  async getExistingColumns(tableName) {
    const sql = `SHOW COLUMNS FROM ${tableName}`;
    try {
      const [rows] = await this.pool.execute(sql);
      return rows.reduce((acc, row) => {
        acc[row.Field] = row.Type.toUpperCase();
        return acc;
      }, {});
    } catch (err) {
      console.error(`Error fetching columns for table '${tableName}':`, err);
      throw err;
    }
  }

  async updateTableSchema(tableName, columns) {
    const existingColumns = await this.getExistingColumns(tableName);
    const newColumns = columns.filter(({ name }) => !existingColumns[name]);
    const modifyColumns = columns.filter(
      ({ name, type }) =>
        existingColumns[name] && existingColumns[name] !== type
    );

    for (const { name, type, attributes = [] } of newColumns) {
      const sql = `ALTER TABLE ${tableName} ADD ${name} ${type} ${attributes.join(
        " "
      )}`;
      try {
        await this.pool.execute(sql);
        console.log(`Added column '${name}' to table '${tableName}'`);
      } catch (err) {
        console.error(
          `Error adding column '${name}' to table '${tableName}':`,
          err
        );
        throw err;
      }
    }

    for (const { name, type, attributes = [] } of modifyColumns) {
      const sql = `ALTER TABLE ${tableName} MODIFY ${name} ${type} ${attributes.join(
        " "
      )}`;
      try {
        await this.pool.execute(sql);
        console.log(`Modified column '${name}' in table '${tableName}'`);
      } catch (err) {
        console.error(
          `Error modifying column '${name}' in table '${tableName}':`,
          err
        );
        throw err;
      }
    }
  }

  async createTable(tableName, columns) {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columns
          .map(
            ({ name, type, attributes = [] }) =>
              `${name} ${type} ${attributes.join(" ")}`
          )
          .join(", ")}
      );
    `;

    try {
      const [result] = await this.pool.execute(sql);
      console.log(`Table '${tableName}' created or already exists:`, result);
      this.tables.set(tableName, columns);
      await this.updateTableSchema(tableName, columns);
    } catch (err) {
      console.error(`Error creating table '${tableName}':`, err);
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
      console.error(`Error creating record in table '${table}':`, err);
      throw err;
    }
  }

  async get(table, where, options = {}) {
    const { include = [], select = [] } = options;

    // WHERE clause
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const whereValues = Object.values(where);

    // SELECT clause
    const selectClause = select.length > 0 ? select.join(", ") : "*";

    // FROM clause with JOINs for included tables
    let fromClause = `${table}`;
    const joinClauses = include
      .map(({ table: includeTable, on }) => {
        const onClause = Object.entries(on)
          .map(([key, value]) => `${table}.${key} = ${includeTable}.${value}`)
          .join(" AND ");
        return `LEFT JOIN ${includeTable} ON ${onClause}`;
      })
      .join(" ");

    const sql = `SELECT ${selectClause} FROM ${fromClause} ${joinClauses} WHERE ${whereClause}`;

    try {
      const [rows] = await this.pool.execute(sql, whereValues);
      return rows;
    } catch (err) {
      console.error(`Error fetching record from table '${table}':`, err);
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
      console.error(`Error updating record in table '${table}':`, err);
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
      console.error(`Error deleting record from table '${table}':`, err);
      throw err;
    }
  }
}

module.exports = DBService;

// Usage example
const config = {
  host: "localhost",
  user: "root",
  password: "rootpassword",
  database: "testdb",
  port: 5434,
};

const dbService = new DBService(config);

(async () => {
  await dbService.connect();

  // Define columns for User table
  const userColumns = [
    { name: "id", type: "INT", attributes: ["AUTO_INCREMENT", "PRIMARY KEY"] },
    { name: "email", type: "VARCHAR(255)", attributes: ["UNIQUE", "NOT NULL"] },
    { name: "firstName", type: "VARCHAR(255)", attributes: ["NOT NULL"] },
    { name: "lastName", type: "VARCHAR(255)", attributes: ["NOT NULL"] },
    { name: "hashedPassword", type: "VARCHAR(255)", attributes: ["NOT NULL"] },
    {
      name: "sexualPreference",
      type: "VARCHAR(255)",
      attributes: ["NOT NULL"],
    },
    {
      name: "gender",
      type: 'ENUM("MALE", "FEMALE", "OTHER")',
      attributes: ["NOT NULL"],
    },
    { name: "biography", type: "TEXT", attributes: [] },
    { name: "profilePictureUrl", type: "VARCHAR(255)", attributes: [] },
    { name: "fameRating", type: "INT", attributes: ["DEFAULT 0"] },
    {
      name: "createdAt",
      type: "TIMESTAMP",
      attributes: ["DEFAULT CURRENT_TIMESTAMP"],
    },
    {
      name: "updatedAt",
      type: "TIMESTAMP",
      attributes: ["DEFAULT CURRENT_TIMESTAMP", "ON UPDATE CURRENT_TIMESTAMP"],
    },
  ];

  // Create User table
  //   await dbService.createTable("User", userColumns);

  //   // Example operations
  //   await dbService.create("User", {
  //     email: "john.doe@example.com",
  //     firstName: "John",
  //     lastName: "Doe",
  //     name: "John Doe",
  //     hashedPassword: "hashedpassword123",
  //     sexualPreference: "Heterosexual",
  //     gender: "MALE",
  //     biography: "Hello, I am John Doe.",
  //     profilePictureUrl: "http://example.com/profile.jpg",
  //     fameRating: 10,
  //   });

  //   await dbService.update(
  //     "User",
  //     { fameRating: 20 },
  //     { email: "john.doe@example.com" }
  //   );

  //   await dbService.delete("User", { email: "john.doe@example.com" });

  console.log(
    await dbService.get(
      "User",
      { email: "john.doe@example.com" },
      {
        select: ["email", "firstName", "lastName", "Like"],
        // include: [
        //   {
        //     table: "Like",
        //     on: { id: "senderId" },
        //   },
        // ],
      }
    )
  );

  process.exit();
})();
