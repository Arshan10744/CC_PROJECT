import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';
import { OrganizationDto } from 'src/infrastructure/presenter/organization/dto';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { UpdateOrganizationDto } from 'src/infrastructure/presenter/organization/update.dto';
import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { IOrganization } from 'src/domain/models/organization';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { SiteRepository } from 'src/infrastructure/orm/repositories/site.repository';
import { UserRole } from 'src/infrastructure/utilities/enums';

export class OrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userService: UserRepository,
    private readonly siteService: SiteRepository,
  ) {}

  async create(payload: OrganizationDto) {
    let { company, users, sites, ...organizationPayload } = payload;

    let CompanyValue;
    let UsersValue;
    let SitesValue;

    if (users && users.length > 0) {
      UsersValue = await Promise.all(
        users.map(async (id) => await this.userService.getById(id)),
      );
      if (UsersValue.some((user) => !user)) {
        throw new NotFoundException('One or more users not found');
      }
    } else {
      UsersValue = [];
    }

    if (sites && sites.length > 0) {
      SitesValue = await Promise.all(
        sites.map(async (id) => await this.siteService.getById(id)),
      );
      if (SitesValue.some((site) => !site)) {
        throw new NotFoundException('One or more sites not found');
      }
    } else {
      SitesValue = [];
    }

    if (company !== undefined) {
      const existingCompany = await this.companyRepository.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('company not found');
      }
      CompanyValue = { id: existingCompany.id };

      if (UsersValue.length == 0) {
        console.log('I am inside this iffff.......................');
        const users = await this.userService.getByCompanyId(existingCompany.id);
        console.log(users);
        const adminUsers = users.filter((user) => {
          return user.role == 'admin';
        });
        console.log(adminUsers);
        UsersValue = adminUsers;
        console.log('Inside iffffffffffffffff.............', UsersValue);
      }
    } else {
      CompanyValue = null;
    }

    console.log(UsersValue);

    return await this.organizationRepository.create({
      company: CompanyValue,
      users: UsersValue,
      ...organizationPayload,
    });
  }
  async update(
    payload: Partial<UpdateOrganizationDto>,
    id: string,
  ): Promise<UpdateResult> {
    console.log(payload);
    const { company, users, sites, ...organizationPayload } = payload;

    let updatePayload: Partial<organizations> = { ...organizationPayload };

    if (company !== undefined && company !== '') {
      const existingCompany = await this.companyRepository.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      updatePayload.company = { id: existingCompany.id };
    }

    if (company == '') {
      updatePayload.company = null;
    }

    if (users) {
      const usersValue = await Promise.all(
        users.map(async (id) => await this.userService.getById(id)),
      );
      if (usersValue.some((user) => !user)) {
        throw new NotFoundException('One or more users not found');
      }
      await this.organizationRepository.save({
        id: id,
        ...updatePayload,
        users: usersValue,
      });
    }

    if (sites) {
      const SitesValue = await Promise.all(
        sites.map(async (id) => await this.siteService.getById(id)),
      );
      if (SitesValue.some((site) => !site)) {
        throw new NotFoundException('One or more sites not found');
      }
      await this.organizationRepository.save({
        id: id,
        ...updatePayload,
        sites: SitesValue,
      });
    }

    if (isEmptyObject(updatePayload)) {
      return;
    }
    console.log(updatePayload);
    return await this.organizationRepository.update(updatePayload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const organization = await this.organizationRepository.getById(id);
    if (organization) {
      return this.organizationRepository.delete(id);
    }
    throw new NotFoundException('organization Not Found');
  }

  async getAll(): Promise<Partial<IOrganization[]>> {
    return this.organizationRepository.getAll();
  }
}
