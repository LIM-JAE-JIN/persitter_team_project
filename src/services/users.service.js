import { CustomError } from '../middlewares/error.middleware.js';
import { UsersRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';

export class UsersService {
  usersRepository = new UsersRepository();

  signUp = async (email, password, phone, address) => {
    let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');

    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
      throw new CustomError('이메일 형식이 올바르지 않습니다.', 400);
    }

    if (password.length < 6) {
      throw new CustomError('비밀번호는 6자리 이상이어야 합니다', 400);
    }

    const exsistUser = await this.usersRepository.findUserByEmail(email);

    if (exsistUser) {
      throw new CustomError('이미 존재하는 아이디 입니다.', 400);
    }

    const exsistPhone = await this.usersRepository.findUserByPhone(phone);

    if (exsistPhone) {
      throw new CustomError('이미 사용중인 핸드폰 번호 입니다.', 400);
    }

    const salt = process.env.HASH_SALT_ROUNDS;
    const bcryptPassword = bcrypt.hashSync(password, +salt);

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
  };

  signIn = async (req, email, password, next) => {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new CustomError('가입되지 않은 회원 입니다.', 401);
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      throw new CustomError('비밀번호 값이 일치 하지 않습니다.', 403);
    }

    req.session.userId = user.userId;

    return {
      userId: user.userId,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
  };

  putMyInfo = async (userId, password, phone, imgUrl, address) => {
    try {
      const user = await this.usersRepository.findUserById(userId);

      const exsistPhone = await this.usersRepository.findUserByPhone(phone);

      if (exsistPhone) {
        throw new CustomError('이미 사용중인 핸드폰 번호 입니다.', 400);
      }

      await this.usersRepository.updateMyInfo(
        user,
        password,
        phone,
        imgUrl,
        address,
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteMyInfo = async (userId, res) => {
    try {
      await this.usersRepository.deleteMyInfo(userId);
      res.clearCookie('connect.sid');
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
