import { CustomError } from '../middlewares/error.middleware.js';

export class AppointmentsController {
  constructor(appointmentsService) {
    this.appointmentsService = appointmentsService;
  }

  getAppointmentsById = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { email } = req.user;
      const appointments = await this.appointmentsService.getAppointmentsById(
        userId,
        email,
      );

      return res.status(201).json({
        success: true,
        message: '성공적으로 조회했습니다',
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  };
  createAppointment = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { email } = req.user;
      const { sitterName, pets, date, phone, address, significant } = req.body;
      if (!sitterName || !pets || !date || !phone || !address || !significant) {
        throw new CustomError('값의 입력이 필요합니다', 400);
      }
      const createdAppointment =
        await this.appointmentsService.createAppointment(
          userId,
          email,
          sitterName,
          pets,
          date,
          phone,
          address,
          significant,
        );
      return res.status(201).json({
        success: true,
        message: '성공적으로 생성했습니다',
        data: createdAppointment,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteAppointment = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { appointmentId } = req.params;

      const deletedAppointment =
        await this.appointmentsService.deleteAppointment(userId, appointmentId);
      return res.status(201).json({
        success: true,
        message: '성공적으로 삭제했습니다',
        data: deletedAppointment,
      });
    } catch (error) {
      next(error);
    }
  };
}
