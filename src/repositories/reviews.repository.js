export class ReviewsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  appointmentChk = async (userId, sitterId) => {
    const data = await this.prisma.Appointments.findFirst({
      where: {
        userId: +userId,
        sitterId: +sitterId,
      },
    });

    return data;
  };

  createReview = async (sitterId, userId, content, raiting) => {
    const appointment = await this.prisma.Appointments.findFirst({
      where: {
        userId: +userId,
        sitterId: +sitterId,
      },
    });

    const data = await this.prisma.Reviews.create({
      data: {
        sitterId: +sitterId,
        userId,
        content,
        raiting,
      },
    });

    return data;
  };

  getReviews = async (sitterId) => {
    const data = await this.prisma.Reviews.findMany({
      where: { sitterId: +sitterId },
      include: { Users: { select: { email: true, userId: true } } },
    });

    return data;
  };

  getReview = async (sitterId, reviewId) => {
    const data = await this.prisma.Reviews.findFirst({
      where: {
        sitterId: +sitterId,
        reviewId: +reviewId,
      },
    });

    return data;
  };

  updateReview = async (sitterId, reviewId, userId, content, raiting) => {
    const data = await this.prisma.Reviews.update({
      where: {
        sitterId: +sitterId,
        reviewId: +reviewId,
        userId: +userId,
      },
      data: { content, raiting },
    });

    return data;
  };

  deleteReview = async (sitterId, reviewId, userId) => {
    const data = await this.prisma.Reviews.delete({
      where: {
        sitterId: +sitterId,
        reviewId: +reviewId,
        userId: +userId,
      },
    });

    return data;
  };
}
