export class PetsitterController {
  constructor(petsitterService) {
    this.petsitterService = petsitterService;
  }

  getSitters = async (req, res, next) => {
    try {
      const data = await this.petsitterService.getSitters();

      return res.status(200).json({
        success: true,
        message: "펫시터 조회 성공했습니다.",
        data
      })
    } catch (err) {
      next(err);
    }
  }
}