import { CustomError } from '../middlewares/error.middleware.js';

export class AppointmentsService {
  constructor(appointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }
  getAppointments = async (userId, userEmail) => {
    const appointments = await this.appointmentsRepository.getAppointments(
      userId,
    );
    if (appointments.length === 0) {
      throw new CustomError('예약 정보가 없습니다', 404);
    }
    const sortedAppointments = appointments.sort((a, b) => {
      const numA = new Date(a.date);
      const numB = new Date(b.date);
      return numA - numB;
    });
    return sortedAppointments.map((appointment) => {
      return {
        appointmentId: appointment.appointmentId,
        date: appointment.date,
        sitterName: appointment.PetSitters.name,
        sitterPhone: appointment.PetSitters.phone,
        sitterimgUrl: appointment.PetSitters.imgUrl,
        userId: appointment.userId,
        userEmail: userEmail,
        pets: appointment.pets,
        address: appointment.address,
      };
    });
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
    const createdAppointment =
      await this.appointmentsRepository.createAppointment(
        userId,
        email,
        sitterName,
        pets,
        date,
        phone,
        address,
        significant,
      );

    return {
      appointmentId: createdAppointment.appointmentId,
      sitterName: createdAppointment.sitterName,
      userId: userId,
      sitterName: sitterName,
      userEmail: email,
      date: createdAppointment.date,
      pets: createdAppointment.pets,
      address: createdAppointment.address,
      significant: createdAppointment.significant,
    };
  };

  deleteAppointment = async (userId, appointmentId) => {
    const deletedAppointment =
      await this.appointmentsRepository.deleteAppointment(
        userId,
        appointmentId,
      );
    return deletedAppointment;
  };
}
