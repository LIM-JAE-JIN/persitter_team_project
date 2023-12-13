import { Router } from 'express';
import { reviewsRouter } from './reviews.router.js';
import { usersRouter } from './users.router.js';
import { petsRouter } from './pets.router.js';

const apiRouter = Router();


apiRouter.use('/users', usersRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/pets', petsRouter);

export { apiRouter };
