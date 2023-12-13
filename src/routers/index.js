import { Router } from 'express';

import { reviewsRouter } from './reviews.router.js';

const apiRouter = Router();

apiRouter.use('/reviews', reviewsRouter);

export { apiRouter };
