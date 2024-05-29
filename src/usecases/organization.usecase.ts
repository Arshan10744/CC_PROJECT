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

export class OrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userService: UserRepository,
    private readonly siteService: SiteRepository,
  ) {}
  async create(payload: OrganizationDto) {
    try {
      let { company, users, sites, ...organizationPayload } = payload;

      let CompanyValue;
      let UsersValue = [];
      let SitesValue = [];

      if (users && users.length > 0) {
        UsersValue = await Promise.all(
          users.map(async (id) => await this.userService.getById(id)),
        );
        if (UsersValue.some((user) => !user)) {
          throw new NotFoundException('One or more users not found');
        }
      }

      if (sites && sites.length > 0) {
        SitesValue = await Promise.all(
          sites.map(async (id) => await this.siteService.getById(id)),
        );
        if (SitesValue.some((site) => !site)) {
          throw new NotFoundException('One or more sites not found');
        }
      }

      if (company !== undefined && company !== '') {
        const existingCompany = await this.companyRepository.getById(
          company.toString(),
        );
        if (!existingCompany) {
          throw new NotFoundException('company not found');
        }
        CompanyValue = { id: existingCompany.id };

        if (UsersValue.length === 0) {
          const companyUsers = await this.userService.getByCompanyId(
            existingCompany.id,
          );
          console.log('users of the company-----', companyUsers);
          const adminUsers = companyUsers.filter(
            (user) => user.role === 'admin',
          );
          console.log('admin users of the company-----', adminUsers);
          UsersValue = adminUsers;
        }
      } else {
        CompanyValue = null;
      }

      console.log(
        'Users Value Before Setting it into the payload-----',
        UsersValue,
      );

      return this.organizationRepository.create({
        company: CompanyValue,
        users: UsersValue,
        sites: SitesValue,
        ...organizationPayload,
      });
    } catch (error) {
      return error.message;
    }
  }

  async update(
    payload: Partial<UpdateOrganizationDto>,
    id: string,
  ): Promise<UpdateResult> {
    try {
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
    } catch (error) {
      return error.message;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const organization = await this.organizationRepository.getById(id);
      if (!organization) {
        throw new NotFoundException('organization Not Found');
      }
      return this.organizationRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }

  async getAll(): Promise<Partial<IOrganization[]>> {
    try {
      return this.organizationRepository.getAll();
    } catch (error) {
      return error.message;
    }
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
