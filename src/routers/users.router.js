import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import auth from '../middlewares/need-signin.middleware.js';

const usersRouter = Router();

const userscontroller = new UsersController();

usersRouter.post('/signup', userscontroller.signUp);
usersRouter.post('/signin', userscontroller.signIn);
usersRouter.get('/me', auth, userscontroller.getMyInfo);
usersRouter.put('/me', auth, userscontroller.putMyInfo);
usersRouter.delete('/me', auth, userscontroller.deleteMyInfo);

export { usersRouter };
