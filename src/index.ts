import express, { Express, Request, Response } from 'express';
import { port } from './secrets';
import rootRouter from './routes';

const app: Express = express();

app.use('/api', rootRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
