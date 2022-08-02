import express from 'express';
import { getRoot, getMenu } from './routes.js';

// reply on /menu with empty json object
const app = express();

app.get('/', getRoot);

app.get('/menu', getMenu);

// boot
app.listen(3000, () => {
  console.log('listening on port 3000');
});
