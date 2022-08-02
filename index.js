import express from 'express';
import menu from './menu.js';

// reply on /menu with empty json object
const app = express();

app.get('/', (_, res) => {
  res.json({ message: "Hi, I'm a shitty API!" });
});

app.get('/menu', (_, res) => {
  res.json({ menu });
});

// boot
app.listen(3000, () => {
  console.log('listening on port 3000');
});
