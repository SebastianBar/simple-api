import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { wrapRoutes } from './routes.js';
import { sequelize } from './db/index.js';

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Burger Queen API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_, res) => {
  res.redirect('/api-docs');
});
wrapRoutes(app);

// boot
const server = app.listen(3000, () => {
  console.log('listening on port 3000');
  sequelize.sync();
});

const gracefulShutdown = () => {
  console.info('shutdown signal received, shutting down gracefully');
  server.close(() => {
    console.info('server has been shutdown');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
