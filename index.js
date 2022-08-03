import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { getMenu, getOrders, postOrder } from './routes.js';
import { sequelize } from './db/index.js';

const app = express();
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Burger Queen API',
      version: '1.0.0',
    },
  },
  apis: ['./routes.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_, res) => {
  res.redirect('/api-docs');
});
app.get('/menu', getMenu);
app.get('/orders', getOrders);
app.post('/orders', postOrder);

// boot
app.listen(3000, () => {
  console.log('listening on port 3000');
  sequelize.sync();
});
