import express from 'express';
import 'dotenv/config'
import { apiRouter } from './routers/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);

app.use(express.static("./assets"));

app.listen(process.env.SERVER_PORT, () => {
  console.log(`연결성공, 포트 ${process.env.SERVER_PORT}`);
});
