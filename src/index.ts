import express, { Express, Request, Response } from 'express';
import { port } from './secrets';
import rootRouter from './routes';

import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';

const app: Express = express();

app.use(express.json());

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
