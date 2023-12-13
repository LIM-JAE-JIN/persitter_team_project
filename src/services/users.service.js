import { UsersRepository } from '../repository/users.repository.js';
import bcrypt from 'bcrypt';

export class UsersService {
  usersRepository = new UsersRepository();

  signUp = async (email, password, phone, address) => {
    try {
      const bcryptPassword = bcrypt.hashSync(password, 10);

      const newUser = await this.usersRepository.signUp(
        email,
        bcryptPassword,
        phone,
        address,
      );
      return {
        userId: newUser.userId,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
      };
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  signIn = async (req, email, password) => {
    try {
      const user = await this.usersRepository.findUserByEmail(email);

      if (!user) {
        throw Error('찾으시는 유저가 없습니다.');
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        throw Error('비밀번호 값이 일치 하지 않습니다.');
      }

      req.session.userId = user.userId;

      return {
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
