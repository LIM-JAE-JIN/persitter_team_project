import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  signUp = async (email, password, phone, address) => {
    try {
      const newUser = await prisma.Users.create({
        data: {
          email,
          password,
          phone,
          address,
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
