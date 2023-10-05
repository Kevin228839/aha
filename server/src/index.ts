import express, {NextFunction, Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import {router} from './router';
const app = express();
const port = 8000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/', router);

app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.use('/', (_req, res, next) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'), err => {
    next(err);
  });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = 500;
    console.error(err.message);
    res.status(statusCode).json({message: 'Oops! Server Error'});
  }
);

https
  .createServer(
    {
      key: fs.readFileSync('../ssl/key.pem'),
      cert: fs.readFileSync('../ssl/certificate.pem'),
    },
    app
  )
  .listen(port, () => {
    console.log(`Server is listening at port:${port}`);
  });
