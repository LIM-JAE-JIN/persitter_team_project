import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { AppointmentsController } from '../controllers/appointment.contoller.js';
import { AppointmentsService } from '../services/appointment.service.js';
import { AppointmentsRepository } from '../repositories/appointment.repository.js';
import auth from '../middlewares/need-signin.middleware.js';
const appointmentRouter = express.Router();

const appointmentsRepository = new AppointmentsRepository(prisma);
const appointmentsService = new AppointmentsService(appointmentsRepository);
const appointmentsController = new AppointmentsController(appointmentsService);

// 내 예약정보 조회
appointmentRouter.get('/', auth, appointmentsController.getAppointmentsById);

// 예약 생성
appointmentRouter.post('/', auth, appointmentsController.createAppointment);

// 예약 삭제
appointmentRouter.delete(
  '/:appointmentId',
  auth,
  appointmentsController.deleteAppointment,
);

export { appointmentRouter };
