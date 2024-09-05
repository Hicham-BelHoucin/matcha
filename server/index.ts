// src/index.ts
import { Database } from "./sql-builder/database";
import { QueryBuilder } from "./sql-builder/queryBuilder";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { routes } from "./routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

routes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  app[method](path, ...middleware, handler);
});

app.listen(PORT, () => {
  console.log(`Express Typescript app @ http://localhost:${PORT}`);
});
// async function main() {
//   // Initialize the database and apply migrations
//   //   await Database.applyMigrations();

//   // Example: Define a table and generate a query
//   const usersTable = new QueryBuilder("User");
//   // const query = usersTable.select().toString();

//   const query = usersTable.updateById(7, {
//     username: "Hicham El Khalfi",
//     firstName: "Hicham",
//     lastName: "El Khalfi",
//   });

//   // // Execute the query
//   console.log("Executing query:", query);
//   const result = await Database.query(query);
//   console.log("Query Result:", result);

//   // Close the database connection
//   await Database.close();
// }

// main().catch(console.error);
