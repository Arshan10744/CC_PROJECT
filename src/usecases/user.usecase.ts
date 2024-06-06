import {
  UserDto,
  UpdateUserDto,
  updatePasswordDto,
} from 'src/infrastructure/presenter/user/dto';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { IUser } from 'src/domain/models/user';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { BcryptService } from 'src/infrastructure/services/bcrypt.service';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';

export class UserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyService: CompanyRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(payload: UserDto) {
    let { organizations, company, role, ...userPayload } = payload;

    let companyValue;
    let organizationsValue = [];

    if (company !== undefined && company !== '') {
      const existingCompany = await this.companyService.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      companyValue = { id: existingCompany.id };

      if (role === 'admin') {
        organizationsValue =
          await this.organizationService.getByCompanyId(company);
      } else {
        if (organizations?.length) {
          organizationsValue = await Promise.all(
            organizations.map(async (id) => {
              const organization = await this.organizationService.getById(id);
              if (organization && organization.company.id === company) {
                return organization;
              }
              return null;
            }),
          );
          if (organizationsValue.some((organization) => !organization)) {
            throw new NotFoundException(
              'One or more organizations not found or do not belong to the specified company',
            );
          }
        }
      }
    } else {
      throw new BadRequestException('Company must be provided');
    }

    const hash = await this.bcryptService.hash(payload.password);
    userPayload.password = hash;

    return await this.userRepository.create({
      company: companyValue,
      organizations: organizationsValue,
      ...userPayload,
    });
  }

  async update(
    payload: Partial<UpdateUserDto>,
    id: string,
  ): Promise<UpdateResult> {
    const { organizations, role, ...userPayload } = payload;

    let updatePayload: Partial<users> = { ...userPayload };
    let organizationsValue = [];

    const user = await this.userRepository.getById(id);

    if (role) {
      updatePayload.role = role;
    }

    if (role === 'admin') {
      organizationsValue = await this.organizationService.getByCompanyId(
        user.company.id,
      );
      await this.userRepository.save({
        id: id,
        ...updatePayload,
        organizations: organizationsValue,
      });
    } else {
      if (organizations) {
        organizationsValue = await Promise.all(
          organizations.map(async (id) => {
            const organization = await this.organizationService.getById(id);
            if (organization && organization.company.id === user.company.id) {
              return organization;
            }
            return null;
          }),
        );
        if (organizationsValue.some((organization) => !organization)) {
          throw new NotFoundException(
            'One or more organizations not found or do not belong to the specified company',
          );
        }
        await this.userRepository.save({
          id: id,
          ...updatePayload,
          organizations: organizationsValue,
        });
      } else {
        await this.userRepository.save({
          id: id,
          ...updatePayload,
          organizations: organizationsValue,
        });
      }
    }

    if (isEmptyObject(updatePayload)) {
      return;
    }
    return await this.userRepository.update(updatePayload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return this.userRepository.delete(id);
  }

  async getByCompanyId(id: string): Promise<IUser[]> {
    const company = this.companyService.getById(id);

    if (!company) {
      throw new NotFoundException('Company Not Found');
    }

    return this.userRepository.getByCompanyId(id);
  }

  async getAll(userId: string): Promise<Partial<IUser[]>> {
    const user = await this.userRepository.getById(userId);
    console.log(user);
    return this.userRepository.getAll(user);
  }

  async getPaginatedUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<IUser[]> {
    return this.userRepository.getPaginatedUsers(pageNumber, pageSize);
  }

  async updatePassword(
    userId: string,
    payload: updatePasswordDto,
  ): Promise<UpdateResult> {
    const { password } = payload;
    const hash = await this.bcryptService.hash(password);
    return this.userRepository.updatePassword(userId, hash);
  }
}
