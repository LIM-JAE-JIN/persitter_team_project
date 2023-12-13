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
}
