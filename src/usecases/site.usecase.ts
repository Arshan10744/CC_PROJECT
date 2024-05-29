import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';
import { SiteRepository } from 'src/infrastructure/orm/repositories/site.repository';
import { SiteDto } from 'src/infrastructure/presenter/site/dto';
import { UpdateSiteDto } from 'src/infrastructure/presenter/site/update.dto';
import { sites } from 'src/infrastructure/orm/entities/site.entity';
import { ISite } from 'src/domain/models/site';
import { isEmptyObject } from 'src/infrastructure/utilities/utlis';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';

export class SiteUseCase {
  constructor(
    private readonly siteRepository: SiteRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly companyService: CompanyRepository,
  ) {}

  async create(payload: SiteDto) {
    try {
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
      } else {
        organizationValue = null;
      }

      return await this.siteRepository.create({
        organization: organizationValue,
        ...sitePayload,
      });
    } catch (error) {
      return error.message;
    }
  }
  async update(
    payload: Partial<UpdateSiteDto>,
    id: string,
  ): Promise<UpdateResult> {
    try {
      const { organization, ...userPayload } = payload;

      let updatePayload: Partial<sites> = { ...userPayload };

      if (organization !== undefined && organization !== '') {
        const existingOrganization = await this.organizationService.getById(
          organization.toString(),
        );
        if (!existingOrganization) {
          throw new NotFoundException('Organization not found');
        }
        updatePayload.organization = { id: existingOrganization.id };
      }

      if (organization == '') {
        updatePayload.organization = null;
      }

      if (isEmptyObject(updatePayload)) {
        return;
      }
      return await this.siteRepository.update(updatePayload, id);
    } catch (error) {
      return error.message;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const site = await this.siteRepository.getById(id);
      if (!site) {
        throw new NotFoundException('site Not Found');
      }
      return this.siteRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }

  async getAll(): Promise<Partial<ISite[]>> {
    return this.siteRepository.getAll();
  }

  async getAllByOrganizationId(id: string): Promise<ISite[]> {
    try {
      const organization = await this.organizationService.getById(id);
      if (!organization) {
        throw new NotFoundException('Organization Not Found');
      }
      return this.siteRepository.getAllByOrganizationId(id);
    } catch (error) {
      return error.message;
    }
  }

  async getAllByCompanyId(id: string): Promise<ISite[]> {
    try {
      const company = await this.companyService.getById(id);
      if (!company) {
        throw new NotFoundException('company Not Found');
      }
      console.log(company);
      return this.siteRepository.getAllByCompanyId(company.id);
    } catch (error) {
      return error;
    }
  }

  async getPaginatedSites(
    pageNumber: number,
    pageSize: number,
  ): Promise<ISite[]> {
    return this.siteRepository.getPaginatedSites(pageNumber, pageSize);
  }
}
