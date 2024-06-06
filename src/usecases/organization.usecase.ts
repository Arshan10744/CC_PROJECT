import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Admin, DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';
import {
  OrganizationDto,
  UpdateOrganizationDto,
} from 'src/infrastructure/presenter/organization/dto';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { IOrganization } from 'src/domain/models/organization';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { SiteRepository } from 'src/infrastructure/orm/repositories/site.repository';

export class OrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userService: UserRepository,
    private readonly siteService: SiteRepository,
  ) {}
  async create(payload: OrganizationDto) {
    const { company, users, sites, ...organizationPayload } = payload;

    let CompanyValue;

    if (company) {
      const existingCompany = await this.companyRepository.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      CompanyValue = { id: existingCompany.id };
    }

    // let SitesValue = [];
    // if (sites?.length) {
    //   const sitesPromises = sites.map((id) => this.siteService.getById(id));
    //   SitesValue = await Promise.all(sitesPromises);
    //   if (SitesValue.some((site) => !site)) {
    //     throw new NotFoundException('One or more sites not found');
    //   }
    // }

    let AdminUsersValue = [];
    const companyUsers = await this.userService.getByCompanyId(CompanyValue.id);
    AdminUsersValue = companyUsers.filter((user) => user.role === 'admin');

    let UsersValue = [];

    if (users?.length) {
      UsersValue = await Promise.all(
        users.map(async (id) => {
          const user = await this.userService.getById(id);
          if (user && user.company.id === company) {
            return user;
          }
          return null;
        }),
      );
      if (UsersValue.some((user) => !user)) {
        throw new NotFoundException(
          'One or more user not found or do not belong to the specified company',
        );
      }
    } else {
      throw new BadRequestException('Company must be provided');
    }

    return this.organizationRepository.create({
      company: CompanyValue,
      users: [...AdminUsersValue, ...UsersValue],
      // sites: SitesValue,
      ...organizationPayload,
    });
  }

  async update(
    payload: Partial<UpdateOrganizationDto>,
    id: string,
  ): Promise<UpdateResult> {
    const { users, sites, ...organizationPayload } = payload;

    let updatePayload: Partial<organizations> = { ...organizationPayload };

    let usersValue = [];
    let AdminUsersValue = [];

    if (users) {
      usersValue = await Promise.all(
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

    // if (company) {
    //   const companyUsers = await this.userService.getByCompanyId(company);
    //   AdminUsersValue = companyUsers.filter((user) => user.role === 'admin');

    //   await this.organizationRepository.save({
    //     id: id,
    //     ...updatePayload,
    //     users: [...usersValue, ...AdminUsersValue],
    //   });
    // }

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
    return await this.organizationRepository.update(updatePayload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const organization = await this.organizationRepository.getById(id);
    if (!organization) {
      throw new NotFoundException('organization Not Found');
    }
    return this.organizationRepository.delete(id);
  }

  async getAll(userId: string): Promise<Partial<IOrganization[]>> {
    return this.organizationRepository.getAll(userId);
  }

  async getPaginatedOrganizations(
    pageNumber: number,
    pageSize: number,
  ): Promise<IOrganization[]> {
    return this.organizationRepository.getPaginatedOrganizations(
      pageNumber,
      pageSize,
    );
  }
}
