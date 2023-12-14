import { CustomError } from '../middlewares/error.middleware.js';

export class AppointmentsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getAppointments = async (userId) => {
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
  createAppointment = async (
    userId,
    email,
    sitterName,
    pets,
    date,
    phone,
    address,
    significant,
  ) => {
    const getSitterId = await this.prisma.PetSitters.findFirst({
      where: { name: sitterName },
    });

    if (!getSitterId) {
      throw new CustomError('존재하지 않는 시터입니다', 404);
    }
    const createdAppointment = await this.prisma.Appointments.create({
      data: {
        sitterId: getSitterId.sitterId,
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

  deleteAppointment = async (userId, appointmentId) => {
    const appointment = await this.prisma.Appointments.findUnique({
      where: {
        appointmentId: +appointmentId,
      },
    });
    if (!appointment) {
      throw new CustomError('예약정보가 없습니다', 404);
    }
    const deletedAppointment = await this.prisma.Appointments.delete({
      where: {
        userId: userId,
        appointmentId: +appointmentId,
      },
    });
    return deletedAppointment;
  };
}
