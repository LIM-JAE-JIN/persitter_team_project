import { Router } from 'express';
import { UsersController } from '../controller/users.controller.js';
const usersRouter = Router();

const userscontroller = new UsersController();

usersRouter.post('/signup', userscontroller.signUp);

export { usersRouter };
