import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {router} from './router';
const app = express();
const port = 8000;
const corsOption = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', router);

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = 500;
    console.error(err.message);
    res.status(statusCode).json({message: 'Oops! Server Error'});
  }
);

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
