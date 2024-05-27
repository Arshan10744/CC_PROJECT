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
    let { organizations, company, ...userPayload } = payload;

    let companyValue;
    let organizationsValue;

    if (company !== undefined) {
      const existingCompany = await this.companyService.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      //   console.log(existingGroup);
      companyValue = { id: existingCompany.id };
    } else {
      companyValue = null;
    }

    if (organizations) {
      organizationsValue = await Promise.all(
        organizations.map(
          async (id) => await this.organizationService.getById(id),
        ),
      );
      if (organizationsValue.some((organization) => !organization)) {
        throw new NotFoundException('One or more organization not found');
      }
    } else {
      organizationsValue = [];
    }
    const hash = await this.bcryptService.hash(payload.password);
    userPayload.password = hash;

    // console.log(departmentsValue, groupValue, userPayload);
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
    const { company, organizations, password, ...userPayload } = payload;

    let updatePayload: Partial<users> = { ...userPayload };

    if (company !== undefined && company !== '') {
      console.log('checked for undfiend and null');
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

  //   // async findByUsername(username: string): Promise<UserDto> {
  //   //   return this.userRepository.findByUsername(username);
  //   // }

  async getAll(): Promise<Partial<IUser[]>> {
    return this.userRepository.getAll();
  }

  //   async getById(id: string): Promise<Partial<IUser>> {
  //     return this.userRepository.getById(id);
  //   }

  //   async getAllByGroup(groupId: string): Promise<IUser[]> {
  //     return this.userRepository.getAllByGroup(groupId);
  //   }

  //   async getAllByDepartment(departmentId: string): Promise<IUser[]> {
  //     return this.userRepository.getAllByDepartment(departmentId);
  //   }
}
