import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from 'src/domain/repositories/auth.interface';
import { users } from '../entities/user.entity';

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
}
