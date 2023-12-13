export class ReviewsService {
  constructor(reviewsRepository) {
    this.reviewsRepository = reviewsRepository;
  }

  createReview = async (sitterId, userId, email, content, rating) => {
    const data = await this.reviewsRepository.createReview(sitterId, userId, content, rating);

    const userChk = await this.reviewsRepository.appointmentChk(userId, sitterId);

    if (userChk) throw new Error('리뷰 작성 권한이 없습니다.', 403);

    return {
      reviewId: data.reviewId,
      email: email,
      content: data.content,
      rating: data.rating,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  getReviews = async (sitterId) => {
    const data = await this.reviewsRepository.getReviews(sitterId);

    // 내림차순
    data.sort((a, b) => b.createdAt - a.createdAt);

    return data.map((review) => {
      return {
        reviewId: data.reviewId,
        email: data.Users.email,
        content: data.content,
        rating: data.rating,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    })
  }

  updateReview = async (sitterId, reviewId, userId, content, rating) => {

    // 리뷰가 존재하지 않는 경우
    const review = await this.reviewsRepository.getReview(sitterId, reviewId, userId);

    if (!review) throw new CustomError('리뷰가 없습니다', 404);

    // 리뷰 수정 권한
    const isMatchedId = review.userId === userId;
    if (!isMatchedId) throw new CustomError('리뷰 수정 권한이 없습니다.', 403);

    const data = await this.reviewsRepository.updateReview(sitterId, reviewId, userId, content, rating);

    return {
      reviewId: data.reviewId,
      content: data.content,
      rating: data.rating,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }

  deleteReview = async (sitterId, reviewId, userId) => {
    // 리뷰가 존재하지 않는 경우
    const review = await this.reviewsRepository.getReview(sitterId, reviewId, userId);

    if (!review) throw new CustomError('리뷰가 없습니다', 404);

    // 리뷰 수정 권한
    const isMatchedId = review.userId === userId;
    if (!isMatchedId) throw new CustomError('리뷰 삭제 권한이 없습니다.', 403);


    const data = await this.reviewsRepository.deleteReview(sitterId, reviewId, userId);

    return {
      reviewId: data.reviewId,
      content: data.content,
      rating: data.rating,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }
}