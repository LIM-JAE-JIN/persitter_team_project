import { CustomError } from '../middlewares/error.middleware.js';

export class AppointmentsService {
  constructor(appointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }
  getAppointmentsById = async (userId, userEmail) => {
    const appointments = await this.appointmentsRepository.getAppointmentsById(
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
    const findSitter = await this.appointmentsRepository.getSitterByName(
      sitterName,
    );
    if (!findSitter) {
      throw new CustomError('존재하지 않는 시터입니다', 404);
    }
    const findAppointment = await this.appointmentsRepository.checkAppointment(
      findSitter.sitterId,
      date,
    );
    if (findAppointment) {
      throw new CustomError('해당한 날짜에 예약이 이미 존재합니다', 409);
    }
    const createdAppointment =
      await this.appointmentsRepository.createAppointment(
        userId,
        findSitter.sitterId,
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
    const appointment = await this.appointmentsRepository.getAppointmentById(
      appointmentId,
    );
    if (!appointment) {
      throw new CustomError('예약정보가 없습니다', 404);
    }
    if (appointment.userId !== userId) {
      throw new CustomError('삭제할 권한이 없습니다', 403);
    }
    const deletedAppointment =
      await this.appointmentsRepository.deleteAppointment(
        userId,
        appointmentId,
      );
    return deletedAppointment;
  };
}
