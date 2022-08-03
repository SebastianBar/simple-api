import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { getMenu } from './routes.js';

const app = express();

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

// boot
app.listen(3000, () => {
  console.log('listening on port 3000');
});
