import { UsersService } from '../service/users.service.js';

export class UsersController {
  usersService = new UsersService();
  signUp = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, phone, address } = req.body;

      if (!email) {
        throw Error('이메일을 입력해주세요');
      }

      if (!password) {
        throw Error('비밀번호를 입력해주세요');
      }

      if (!confirmPassword) {
        throw Error('비밀번호 확인을 입력해주세요');
      }

      if (!phone) {
        throw Error('핸드폰 번호를 입력해주세요');
      }

      if (!address) {
        throw Error('주소를 입력해주세요');
      }

      if (password !== confirmPassword) {
        throw Error('비밀번호와, 비밀번호 확인이 동일하지 않습니다.');
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
        throw Error('이메일을 입력해주세요');
      }

      if (!password) {
        throw Error('비밀번호를 입력해주세요');
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

  getMyInfo = async (req, res, next) => {
    try {
      const user = req.user;
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
