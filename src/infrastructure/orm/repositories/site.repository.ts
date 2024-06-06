import { UserPresenter } from 'src/infrastructure/presenter/user/user.presenter';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { ISiteRepository } from 'src/domain/repositories/site.interface';
import { sites } from '../entities/site.entity';
import { ISite } from 'src/domain/models/site';
import { plainToInstance } from 'class-transformer';
import { SitePresenter } from 'src/infrastructure/presenter/site/site.presenter';
import { users } from '../entities/user.entity';
import { UserRepository } from './user.repository';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class SiteRepository implements ISiteRepository {
  constructor(
    @InjectRepository(sites)
    private readonly siteRepository: Repository<sites>,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(payload: Partial<sites>): Promise<string> {
    const site = this.siteRepository.create(payload);
    await this.siteRepository.save(site);
    return 'site Created Successfully';
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.siteRepository.delete({ id });
  }

  async update(payload: Partial<sites>, id: string): Promise<UpdateResult> {
    return this.siteRepository.update({ id }, payload);
  }

  async getAll(payload: Partial<users>): Promise<sites[]> {
    if (payload.role === 'admin') {
      return this.siteRepository.find({ relations: { organization: true } });
    }

    const userOrganizations = await this.organizationRepository.getByUserId(
      payload.id,
    );
    const organizationIds = userOrganizations.map(
      (organization) => organization.id,
    );

    const sites = await this.siteRepository.find({
      where: { organization: { id: In(organizationIds) } },
    });

    return sites;
  }

  async getAllByOrganizationId(id: string): Promise<ISite[]> {
    return this.siteRepository.find({
      where: {
        organization: { id },
      },
    });
  }

  async getAllByCompanyId(id: string): Promise<ISite[]> {
    const sites = await this.siteRepository.find({
      relations: ['organization', 'organization.company'],
    });
    return plainToInstance(SitePresenter, sites, {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: string): Promise<sites> {
    return this.siteRepository.findOneBy({ id });
  }

  async getPaginatedSites(
    pageNumber: number,
    pageSize: number,
  ): Promise<ISite[]> {
    const sites = await this.siteRepository.find({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      relations: { organization: true },
    });
    return plainToInstance(SitePresenter, sites, {
      excludeExtraneousValues: true,
    });
  }
}
