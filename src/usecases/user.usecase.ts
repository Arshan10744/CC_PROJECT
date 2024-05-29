import { UserDto } from 'src/infrastructure/presenter/user/dto';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { IUser } from 'src/domain/models/user';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { BcryptService } from 'src/infrastructure/services/bcrypt.service';
import { UpdateUserDto } from 'src/infrastructure/presenter/user/update.dto';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';

export class UserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyService: CompanyRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(payload: UserDto) {
    try {
      let { organizations, company, ...userPayload } = payload;

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
      } else {
        companyValue = null;
      }

      if (organizations?.length) {
        organizationsValue = await Promise.all(
          organizations.map(
            async (id) => await this.organizationService.getById(id),
          ),
        );
        if (organizationsValue.some((organization) => !organization)) {
          throw new NotFoundException('One or more organization not found');
        }
      }

      const hash = await this.bcryptService.hash(payload.password);
      userPayload.password = hash;

      return await this.userRepository.create({
        company: companyValue,
        organizations: organizationsValue,
        ...userPayload,
      });
    } catch (error) {
      return error.message;
    }
  }

  async signUp(payload: Partial<UserDto>) {
    try {
      let { organizations, company, ...userPayload } = payload;

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
      } else {
        companyValue = null;
      }

      if (organizations?.length) {
        organizationsValue = await Promise.all(
          organizations.map(
            async (id) => await this.organizationService.getById(id),
          ),
        );
        if (organizationsValue.some((organization) => !organization)) {
          throw new NotFoundException('One or more organization not found');
        }
      }

      const hash = await this.bcryptService.hash(payload.password);
      userPayload.password = hash;

      return await this.userRepository.signup({
        company: companyValue,
        organizations: organizationsValue,
        ...userPayload,
      });
    } catch (error) {
      return error.message;
    }
  }

  async update(
    payload: Partial<UpdateUserDto>,
    id: string,
  ): Promise<UpdateResult> {
    try {
      const { company, organizations, password, ...userPayload } = payload;

      let updatePayload: Partial<users> = { ...userPayload };

      if (company !== undefined && company !== '') {
        const existingCompany = await this.companyService.getById(
          company?.toString(),
        );
        if (!existingCompany) {
          throw new NotFoundException('Company not found');
        }
        updatePayload.company = { id: existingCompany.id };
      }

      if (company == '') {
        updatePayload.company = null;
      }

      if (organizations) {
        const organizationValue = await Promise.all(
          organizations.map(
            async (id) => await this.organizationService.getById(id),
          ),
        );
        if (organizationValue.some((organization) => !organization)) {
          throw new NotFoundException('One or more organizations not found');
        }
        await this.userRepository.save({
          id: id,
          ...updatePayload,
          organizations: organizationValue,
        });
      }

      if (password) {
        const hash = await this.bcryptService.hash(password);
        updatePayload.password = hash;
      }

      if (isEmptyObject(updatePayload)) {
        return;
      }
      return await this.userRepository.update(updatePayload, id);
    } catch (error) {
      return error.message;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const user = await this.userRepository.getById(id);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      return this.userRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }

  async getByCompanyId(id: string): Promise<IUser[]> {
    try {
      const company = this.companyService.getById(id);

      if (!company) {
        throw new NotFoundException('Company Not Found');
      }

      return this.userRepository.getByCompanyId(id);
    } catch (error) {
      return error.message;
    }
  }

  async getAll(): Promise<Partial<IUser[]>> {
    try {
      return this.userRepository.getAll();
    } catch (error) {
      return error.message;
    }
  }

  async getPaginatedUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<IUser[]> {
    return this.userRepository.getPaginatedUsers(pageNumber, pageSize);
  }
}
