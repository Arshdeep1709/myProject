//here we will create our server

import express from 'express';
import cookies from 'cookie-parser';
import cors from 'cors';
import userRoute from '../routes/userRoute.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookies());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/user', userRoute);

export default app;