export class ReviewsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  appointmentChk = async (userId, sitterId) => {
    const data = await this.prisma.Appointments.findUnique({
      where: {
        userId: +userId,
        sitterId: +sitterId
      }
    })

    return data;
  }

  createReview = async (sitterId, userId, content, rating) => {
    const data = await this.prisma.Reviews.create({
      data: {
        sitterId,
        userId,
        content,
        rating
      }
    })

    return data;
  }

  getReviews = async (sitterId) => {
    const data = await this.prisma.Reviews.findMany({
      where: { sitterId: +sitterId },
      include: { USers: { select: { email: true } } }
    })

    return data;
  }

  updateReview = async (sitterId, reviewId, userId, content, rating) => {
    const data = await this.prisma.Reviews.update({
      where: {
        sitterId: +sitterId,
        reviewId: +reviewId,
        userId: +userId
      },
      data: { content, rating }
    })

    return data;
  }

  deleteReiview = async (sitterId, reviewId, userId) => {
    const data = await this.prisma.Reviews.delete({
      where: {
        sitterId: +sitterId,
        reviewId: +reviewId,
        userId: +userId
      }
    })

    return data;
  }
}