import express from 'express';
import 'dotenv/config';
import { apiRouter } from './routers/index.js';
import expressSession from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import cookieParser from 'cookie-parser';
import errorHandling from './middlewares/error.middleware.js';
import cors from 'cors';

const app = express();


// MySQLStore를 Express-Session을 이용해 생성합니다.
const MySQLStore = expressMySQLSession(expressSession);
// MySQLStore를 이용해 세션 외부 스토리지를 선언합니다.
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24, // 세션의 만료 기간을 1일로 설정합니다.
  createDatabaseTable: true, // 세션 테이블을 자동으로 생성합니다.
});

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // 클라이언트의 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false, // 세션이 초기화되지 않았을 때 세션을 저장할 지 설정
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 기간을 1일로 설정합니다.
      httpOnly: false
    },
  }),
);
app.use('/api', apiRouter);
app.use(express.static('./assets'));
app.use(errorHandling);


app.listen(process.env.SERVER_PORT, () => {
  console.log(`연결성공, 포트 ${process.env.SERVER_PORT}`);
});


