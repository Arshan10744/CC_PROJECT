import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IUserRepository } from 'src/domain/repositories/user.inerface';
import { users } from '../entities/user.entity';
import { IUser } from 'src/domain/models/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(users)
    private readonly userRepository: Repository<users>,
  ) {}

  async create(payload: Partial<users>): Promise<string> {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return 'user Created Successfully';
  }

  async signup(payload: Partial<IUser>): Promise<string> {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return 'Sign Up Successfull';
  }

  async delete(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    user.organizations = [];
    await this.userRepository.save(user);

    return this.userRepository.delete({ id });
  }

  async update(payload: Partial<users>, id: string): Promise<UpdateResult> {
    return this.userRepository.update({ id }, payload);
  }

  async getAll(): Promise<users[]> {
    return this.userRepository.find({
      relations: { company: true, organizations: true },
      select: ['id', 'username', 'email', 'role'],
    });
  }

  async save(payload: any) {
    this.userRepository.save(payload);
  }

  async getByCompanyId(id: string): Promise<IUser[]> {
    return this.userRepository.find({
      where: { company: { id: id } },
      select: ['id', 'username', 'email', 'role'],
    });
  }

  async getById(id: string): Promise<users> {
    return this.userRepository.findOneBy({ id });
  }

  async getByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOneBy({ email });
  }

  async enableTwoFactorAuth(userId: string): Promise<void> {
    await this.userRepository.update(userId, { is2faAuthenticated: true });
  }

  async getPaginatedUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<IUser[]> {
    try {
      const users = await this.userRepository.find({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        relations: { company: true, organizations: true },
        select: {
          company: {
            id: true,
            name: true,
          },
          organizations: {
            id: true,
            name: true,
          },
        },
      });

      if (users.length === 0) {
        throw new NotFoundException('No users found for the provided page');
      }

      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch users',
        error.message,
      );
    }
  }
}
