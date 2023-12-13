export class ReviewsController {
  constructor(reviewsService) {
    this.reviewsService = reviewsService
  }

  createReview = async (res, req, next) => {
    try {
      const { sitterId } = req.params;
      const { userId, email } = req.user;
      const { content, rating } = req.body;

      if (!sitterId) throw new CustomError('펫시터가 없습니다.', 400);

      if (!content) throw new CustomError('리뷰를 작성해주세요.', 400);

      if (!rating) throw new CustomError('리뷰점수를 작성해주세요.', 400);

      const data = await this.reviewsService.createReview(sitterId, userId, email, content, rating);

      return res.status(201).json({
        success: true,
        message: "리뷰 작성이 완료되었습니다.",
        data
      })
    } catch (err) {
      next(err)
    }
  }

  getReviews = async (res, req, next) => {
    try {
      const { sitterId } = req.params;

      if (!sitterId) throw new CustomError('펫시터가 없습니다.', 400);

      const data = await this.reviewsService.getReviews(sitterId);

      return res.status(200).json({
        success: true,
        message: "리뷰 조회를 성공했습니다.",
        data
      });
    } catch (err) {
      next(err)
    }
  }

  updateReview = async (res, req, next) => {
    try {
      const { sitterId, reviewId } = req.params;
      const { userId } = req.user;
      const { content, rating } = req.body;

      if (!sitterId) throw new CustomError('펫시터가 없습니다.', 400);

      if (!reviewId) throw new CustomError('리뷰가 없습니다.', 400);

      if (!content && !rating) throw new CustomError('수정 정보는 최소 1개 이상 있어야 합니다.', 400);

      const data = await this.reviewsService.updateReview(sitterId, reviewId, userId, content, rating);

      return res.status(200).json({
        success: true,
        message: "리뷰 수정 완료했습니다.",
        data
      });
    } catch (err) {
      next(err)
    }
  }

  deleteReview = async (res, req, next) => {
    try {
      const { sitterId, reviewId } = req.params;
      const { userId } = req.user;

      const data = await this.reviewsService.deleteReview(sitterId, reviewId, userId);

      return res.status(200).json({
        success: true,
        message: "리뷰 삭제를 완료했습니다.",
        data
      });
    } catch (err) {
      next(err)
    }
  }
}