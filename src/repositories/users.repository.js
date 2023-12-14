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

  findUserByEmail = async (email) => {
    try {
      const user = await prisma.Users.findFirst({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  findUserById = async (userId) => {
    try {
      const user = await prisma.Users.findFirst({
        where: {
          userId: +userId,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateMyInfo = async (user, password, phone, imgUrl, address) => {
    try {
      await prisma.Users.update({
        where: {
          userId: +user.userId,
        },
        data: {
          password: password ?? user.password,
          phone: phone ?? user.phone,
          imgUrl: imgUrl ?? user.imgUrl,
          address: address ?? user.address,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteMyInfo = async (userId) => {
    try {
      await prisma.Users.delete({
        where: {
          userId: +userId,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
