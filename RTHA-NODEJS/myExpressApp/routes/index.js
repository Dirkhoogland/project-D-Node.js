const express = require('express');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require(`swagger-out\swagger_output.json`);

const app = express();
app.use(express.json());

// Dynamically require all route files
const routesFolder = path.join(__dirname, 'routes'); // Path to routes folder
fs.readdirSync(routesFolder).forEach((file) => {
  const route = require(path.join(routesFolder, file));
  if (route && route.path && route.router) {
    app.use(route.path, route.router); // Use the router with its associated path
  }
});

// Swagger documentation
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
  console.log(`Running on port 3000`);
});
