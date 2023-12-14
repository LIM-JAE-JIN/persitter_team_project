import { prisma } from '../utils/prisma/index.js';
import { CustomError } from './error.middleware.js';

export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) throw new CustomError('로그인이 필요합니다.', 403);

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) throw new CustomError('탈퇴한 회원 입니다.', 403);

    delete user.password;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
