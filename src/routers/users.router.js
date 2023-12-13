import { Router } from 'express';
import { UsersController } from '../controller/users.controller.js';
import auth from '../middleware/need-signin.middleware.js';

const usersRouter = Router();

const userscontroller = new UsersController();

usersRouter.post('/signup', userscontroller.signUp);
usersRouter.post('/signin', userscontroller.signIn);
usersRouter.get('/me', auth, userscontroller.getMyInfo);

export { usersRouter };
