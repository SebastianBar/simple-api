import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { wrapRoutes } from './routes.js';
import { sequelize } from './db/sequelize.js';
import { seedMenuItems } from './db/seeder.js'; 

// creates a new express server
const app = express();

// Creates a Swagger specification for our routes, generated from the functions' comments
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Burger Queen API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes.ts', './dist/routes.js']
});

// allow express to receive json payloads
app.use(express.json());

// allow development environments to connect to the server
// NOTE: allowing localhost is a security risk and should be removed once in production
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// expose the Swagger UI docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// redirect root request into Swagger UI docs
app.get('/', (_, res) => {
  res.redirect('/api-docs');
});

// wrap our own created routes with the express app
wrapRoutes(app);

// boot the server up
const port = process.env.PORT || 3000;
const server = app.listen(port, async () => {
  console.log(`🚀 Running on http://localhost:${port}`);
  await sequelize.sync();
  await seedMenuItems();
});

// when the server is shutting down, we want this function to run
const gracefulShutdown = () => {
  console.info('Shutdown signal received! Gracefully shutting down ...');
  server.close(() => {
    console.info('Server is now down. Goodbye! 👋🏻');
    process.exit(0);
  });
};

// calls the gracefulShutdown function when the process is killed either through SIGINT or SIGTERM
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
