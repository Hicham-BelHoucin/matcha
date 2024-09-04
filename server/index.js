const express = require("express");
const connection = require("./routes/db/apply-maigrations");
const app = express();

app.use(express.json());
// Add your routes here
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
// Function to convert regex path to a readable string
// Function to convert regex path to a readable string
function formatRoute(methods, path) {
  const method = methods[0].toUpperCase();
  const blue = "\x1b[34m";
  const green = "\x1b[32m";
  const reset = "\x1b[0m";

  console.log(`${blue}${method}${reset} -> ${green}${path}${reset}`);
}
function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods);
      routes.push({ path, methods });
    } else if (middleware.name === "router") {
      // Middleware registered as Router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          // const path = handler.route.path;
          const basePath = middleware.regexp;
          const path = `${basePath
            .toString()
            .replace("/^\\", "")
            .replace("\\/?(?=\\/|$)/i", "")}${handler.route.path}`;
          const methods = Object.keys(handler.route.methods);
          routes.push({ path, methods });
          formatRoute(methods, path);
        }
      });
    }
  });
  return routes;
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log("Routes:");
  listRoutes(app);

  console.log(`Server is running on port ${port}`);
});
