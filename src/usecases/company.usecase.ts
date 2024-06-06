import { NotFoundException } from '@nestjs/common';
import { ICompany } from 'src/domain/models/company';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import {
  CompanyDto,
  UpdateCompanyDto,
} from 'src/infrastructure/presenter/company/dto';
import { DeleteResult } from 'typeorm';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { companies } from 'src/infrastructure/orm/entities/comapny.entity';

export class CompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly userService: UserRepository,
  ) {}

  async create(payload: CompanyDto): Promise<string> {
    let { users, organizations, ...companyPayload } = payload;

    let organizationsValue = [];
    let usersValue = [];

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

    if (users?.length) {
      usersValue = await Promise.all(
        users.map(async (id) => await this.userService.getById(id)),
      );
      if (usersValue.some((user) => !user)) {
        throw new NotFoundException('One or more users not found');
      }
    }

    await this.companyRepository.create({
      users: usersValue,
      organizations: organizationsValue,
      ...companyPayload,
    });
    return 'company created successfully';
  }

  async update(payload: UpdateCompanyDto, id: string) {
    const { users, organizations, ...companyPayload } = payload;

    const updatePayload: Partial<companies> = { ...companyPayload };

    if (organizations) {
      const organizationsValue = await Promise.all(
        organizations.map(
          async (id) => await this.organizationService.getById(id),
        ),
      );

      if (organizationsValue.some((organization) => !organization)) {
        throw new NotFoundException('One or more organization not found');
      }
      await this.companyRepository.save({
        id: id,
        ...updatePayload,
        organizations: organizationsValue,
      });
    }

    if (users) {
      const usersValue = await Promise.all(
        users.map(async (id) => await this.userService.getById(id)),
      );
      if (usersValue.some((user) => !user)) {
        throw new NotFoundException('One or more users not found');
      }
      await this.companyRepository.save({
        id: id,
        ...updatePayload,
        users: usersValue,
      });
    }

    return await this.companyRepository.update(updatePayload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const company = await this.companyRepository.getById(id);
    if (!company) {
      throw new NotFoundException('Company Not Found');
    }
    return this.companyRepository.delete(id);
  }

  async getAll(): Promise<Partial<ICompany[]>> {
    return this.companyRepository.getAll();
  }

  async getPaginatedCompanies(
    pageNumber: number,
    pageSize: number,
  ): Promise<ICompany[]> {
    return this.companyRepository.getPaginatedCompanies(pageNumber, pageSize);
  }
}
