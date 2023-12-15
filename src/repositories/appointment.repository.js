import { CustomError } from '../middlewares/error.middleware.js';

export class AppointmentsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getAppointmentsById = async (userId) => {
    const appointments = await this.prisma.Appointments.findMany({
      where: { userId: userId },
      include: {
        PetSitters: {
          select: {
            name: true,
            imgUrl: true,
            phone: true,
          },
        },
      },
    });
    return appointments;
  };

  getSitterByName = async (sitterName) => {
    const getSitter = await this.prisma.PetSitters.findFirst({
      where: { name: sitterName },
    });
    return getSitter;
  };

  checkAppointment = async (sitterId, date) => {
    const findAppointment = await this.prisma.Appointments.findFirst({
      where: { date: date, sitterId: sitterId },
    });
    return findAppointment;
  };

  createAppointment = async (
    userId,
    sitterId,
    pets,
    date,
    phone,
    address,
    significant,
  ) => {
    const createdAppointment = await this.prisma.Appointments.create({
      data: {
        sitterId: sitterId,
        userId: userId,
        pets: pets,
        date: date,
        phone: phone,
        address: address,
        significant: significant,
      },
      include: {
        PetSitters: {
          select: {
            name: true,
          },
        },
      },
    });
    return createdAppointment;
  };

  getAppointmentById = async (appointmentId) => {
    const appointment = await this.prisma.Appointments.findUnique({
      where: {
        appointmentId: +appointmentId,
      },
    });
    return appointment;
  };

  deleteAppointment = async (userId, appointmentId) => {
    const deletedAppointment = await this.prisma.Appointments.delete({
      where: {
        userId: userId,
        appointmentId: +appointmentId,
      },
    });
    return deletedAppointment;
  };
}
