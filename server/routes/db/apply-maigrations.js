const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// Read and parse the configuration file
const configPath = path.join(__dirname, "mysql-schema.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  port: 5434,
  user: "test",
  password: "test123",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");

  // Generate SQL and create tables
  createTables(config.tables);
});

function createTables(tables) {
  tables.forEach((table) => {
    let sql = `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;

    // Add columns
    const columns = table.columns.map((col) => {
      let attributes = col.attributes.join(" ");
      return `  \`${col.name}\` ${col.type} ${attributes}`;
    });
    sql += columns.join(",\n");

    // Add foreign keys
    if (table.foreignKeys) {
      const foreignKeys = table.foreignKeys.map((fk) => {
        return `  FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.references.table}\`(\`${fk.references.column}\`)`;
      });
      sql += (foreignKeys.length ? ",\n" : "\n") + foreignKeys.join(",\n");
    }

    sql += "\n);";

    console.log("SQL for table", table.name, ":\n", sql);

    // Execute the SQL to create the table
    connection.query(sql, (err, results) => {
      if (err) {
        console.error(`Error creating table ${table.name}:`, err);
      } else {
        console.log(`Table ${table.name} created or already exists.`);
      }
    });
  });

  // Close the connection after all tables are created
  connection.end();
}

module.exports = connection;
