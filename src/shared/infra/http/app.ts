import 'reflect-metadata';
import 'dotenv/config';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import '../typeorm';

import '@shared/container';

import upload from '@config/upload';
import { AppError } from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';

import swaggerFile from '../../../swagger.json';
import { router } from './routes';

const app = express();

app.use(rateLimiter);

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/avatar', express.static(`${upload.tmpFolder}/cars`));

app.use(router);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);

export { app };
