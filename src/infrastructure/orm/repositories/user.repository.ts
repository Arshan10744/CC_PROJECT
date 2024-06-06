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
import { plainToInstance } from 'class-transformer';
import { UserPresenter } from 'src/infrastructure/presenter/user/user.presenter';
import { CompanyPresenter } from 'src/infrastructure/presenter/company/company.presenter';
import { OrganizationPresenter } from 'src/infrastructure/presenter/organization/organization.presenter';

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

  async getAll(user: users): Promise<users[]> {
    const users = await this.userRepository.find({
      where: {
        company: {
          id: user.company.id,
        },
      },
      relations: { company: true, organizations: true },
    });
    
    return plainToInstance(UserPresenter, users, {
      excludeExtraneousValues: true,
    });
  
  }

  async save(payload: any) {
    this.userRepository.save(payload);
  }

  async getByCompanyId(id: string): Promise<IUser[]> {
    const users = await this.userRepository.find({
      where: { company: { id: id } },
    });
    // return users.map((user)=>{
    //   const userPresenter = new UserPresenter()

    //   userPresenter.id = user.id;
    //   userPresenter.username = user.username;
    //   userPresenter.email = user.email;
    //   userPresenter.company = new CompanyPresenter();
    //   userPresenter.company.id = user.company.id;
    //   userPresenter.organizations = new OrganizationPresenter();
    // })

    return plainToInstance(UserPresenter, users, {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: string): Promise<users> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['company', 'organizations'],
    });
  }

  async getByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOneBy({ email });
  }

  async updatePassword(userId: string, hash: string): Promise<UpdateResult> {
    return this.userRepository.update(userId, { password: hash });
  }

  async getPaginatedUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<IUser[]> {
    const users = await this.userRepository.find({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      relations: { company: true, organizations: true },
    });

    return plainToInstance(UserPresenter, users, {
      excludeExtraneousValues: true,
    });
  }
}
