import { CustomError } from '../middlewares/error.middleware.js';
import { UsersService } from '../services/users.service.js';

export class UsersController {
  usersService = new UsersService();
  signUp = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, phone, address } = req.body;

      if (!email) {
        throw new CustomError('이메일을 입력해 주세요', 400);
      }

      if (!password) {
        throw new CustomError('비밀번호를 입력해 주세요', 400);
      }

      if (!confirmPassword) {
        throw new CustomError('비밀번호 확인을 입력해 주세요', 400);
      }

      if (!phone) {
        throw new CustomError('핸드폰 번호를 입력해 주세요', 400);
      }

      if (!address) {
        throw new CustomError('주소를 입력해주세요', 400);
      }

      if (password !== confirmPassword) {
        throw new CustomError(
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
          400,
        );
      }

      const newUser = await this.usersService.signUp(
        email,
        password,
        phone,
        address,
      );

      return res.status(201).json({
        success: true,
        message: '성공적으로 가입되었습니다.',
        data: {
          userId: newUser.userId,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw new CustomError('이메일을 입력해 주세요', 400);
      }

      if (!password) {
        throw new CustomError('비밀번호를 입력해 주세요', 400);
      }

      const user = await this.usersService.signIn(req, email, password);

      return res.status(201).json({
        success: true,
        message: '성공적으로 로그인 되었습니다.',
        data: {
          userId: user.userId,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  signOut = async (rqe, res, next) => {
    try {
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  getMyInfo = async (req, res, next) => {
    try {
      const user = req.user;
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  putMyInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { password, phone, imgUrl, address } = req.body;
      await this.usersService.putMyInfo(
        userId,
        password,
        phone,
        imgUrl,
        address,
      );

      return res.status(200).json({ message: '성공적으로 수정 되었습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteMyInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;

      await this.usersService.deleteMyInfo(userId, res);
      return res.status(200).json({ message: '회원 탈퇴 완료' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
