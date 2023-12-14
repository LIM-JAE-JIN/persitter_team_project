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

appointmentRouter.get('', auth, appointmentsController.getAppointments);
appointmentRouter.post('', auth, appointmentsController.createAppointment);
appointmentRouter.delete(
  '/:appointmentId',
  auth,
  appointmentsController.deleteAppointment,
);
export { appointmentRouter };
