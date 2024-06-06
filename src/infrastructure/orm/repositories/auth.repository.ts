import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from 'src/domain/repositories/auth.interface';
import { users } from '../entities/user.entity';
import { IUser } from 'src/domain/models/user';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(users)
    private readonly userRepository: Repository<users>,
  ) {}

  async validate(email: string): Promise<users> {
    const user = this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
  async enableTwoFactorAuth(userId: string): Promise<void> {
    await this.userRepository.update(userId, { is2faAuthenticated: true });
  }

  async signup(payload: Partial<IUser>): Promise<string> {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return 'Sign Up Successfull';
  }
}
