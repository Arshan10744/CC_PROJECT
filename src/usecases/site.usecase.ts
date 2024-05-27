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
    let { organization, ...sitePayload } = payload;

    let organizationValue;

    if (organization !== undefined && organization !== '') {
      const existingOrganization = await this.organizationService.getById(
        organization.toString(),
      );
      if (!existingOrganization) {
        throw new NotFoundException('Organization not found');
      }
      //   console.log(existingGroup);
      organizationValue = { id: existingOrganization.id };
    } else {
      organizationValue = null;
    }

    // console.log(departmentsValue, groupValue, userPayload);
    return await this.siteRepository.create({
      organization: organizationValue,
      ...sitePayload,
    });
  }
  async update(
    payload: Partial<UpdateSiteDto>,
    id: string,
  ): Promise<UpdateResult> {
    const { organization, ...userPayload } = payload;

    let updatePayload: Partial<sites> = { ...userPayload };

    if (organization !== undefined && organization !== '') {
      const existingOrganization = await this.organizationService.getById(
        organization.toString(),
      );
      if (!existingOrganization) {
        throw new NotFoundException('Organization not found');
      }
      //   console.log(existingGroup);
      updatePayload.organization = { id: existingOrganization.id };
    }

    if (organization == '') {
      updatePayload.organization = null;
    }

    if (isEmptyObject(updatePayload)) {
      return;
    }
    return await this.siteRepository.update(updatePayload, id);
  }

  async delete(id: string): Promise<DeleteResult> {
    const user = await this.siteRepository.getById(id);
    if (user) {
      return this.siteRepository.delete(id);
    }
    throw new NotFoundException('site Not Found');
  }

  //   // async findByUsername(username: string): Promise<UserDto> {
  //   //   return this.userRepository.findByUsername(username);
  //   // }

  async getAll(): Promise<Partial<ISite[]>> {
    return this.siteRepository.getAll();
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
    console.log(company);
    return this.siteRepository.getAllByCompanyId(company.id);
  }
}
