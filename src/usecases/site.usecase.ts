import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { SiteRepository } from 'src/infrastructure/orm/repositories/site.repository';
import { SiteDto, UpdateSiteDto } from 'src/infrastructure/presenter/site/dto';
import { sites } from 'src/infrastructure/orm/entities/site.entity';
import { ISite } from 'src/domain/models/site';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { users } from 'src/infrastructure/orm/entities/user.entity';

export class SiteUseCase {
  constructor(
    private readonly siteRepository: SiteRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly companyService: CompanyRepository,
  ) {}

  async create(payload: SiteDto) {
    let { organization, ...sitePayload } = payload;

    let organizationValue;

    if (organization !== undefined && organization !== '') {
      const existingOrganization = await this.organizationService.getById(
        organization.toString(),
      );
      if (!existingOrganization) {
        throw new NotFoundException('Organization not found');
      }
      organizationValue = { id: existingOrganization.id };
    }

    return await this.siteRepository.create({
      organization: organizationValue,
      ...sitePayload,
    });
  }
  async update(
    payload: Partial<UpdateSiteDto>,
    id: string,
  ): Promise<UpdateResult> {
    if (isEmptyObject(payload)) {
      return;
    }
    return await this.siteRepository.update(payload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const site = await this.siteRepository.getById(id);
    if (!site) {
      throw new NotFoundException('site Not Found');
    }
    return this.siteRepository.delete(id);
  }

  async getAll(payload: Partial<users>): Promise<Partial<ISite[]>> {
    return this.siteRepository.getAll(payload);
  }

  async getAllByOrganizationId(id: string): Promise<ISite[]> {
    const organization = await this.organizationService.getById(id);
    if (!organization) {
      throw new NotFoundException('Organization Not Found');
    }
    return this.siteRepository.getAllByOrganizationId(id);
  }

  async getAllByCompanyId(id: string): Promise<ISite[]> {
    const company = await this.companyService.getById(id);
    if (!company) {
      throw new NotFoundException('company Not Found');
    }
    return this.siteRepository.getAllByCompanyId(company.id);
  }

  async getPaginatedSites(
    pageNumber: number,
    pageSize: number,
  ): Promise<ISite[]> {
    return this.siteRepository.getPaginatedSites(pageNumber, pageSize);
  }
}
