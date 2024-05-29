import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ISiteRepository } from 'src/domain/repositories/site.interface';
import { sites } from '../entities/site.entity';
import { ISite } from 'src/domain/models/site';

@Injectable()
export class SiteRepository implements ISiteRepository {
  constructor(
    @InjectRepository(sites)
    private readonly siteRepository: Repository<sites>,
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

  async getAll(): Promise<sites[]> {
    return this.siteRepository.find({ relations: { organization: true } });
  }

  async getAllByOrganizationId(id: string): Promise<ISite[]> {
    return this.siteRepository.find({
      where: {
        organization: { id: id },
      },
    });
  }

  async getAllByCompanyId(id: string): Promise<ISite[]> {
    const sites = await this.siteRepository.find({
      relations: ['organization', 'organization.company'],
      where: {
        organization: {
          company: {
            id: id,
          },
        },
      },
    });
    return sites;
  }

  async getById(id: string): Promise<sites> {
    return this.siteRepository.findOneBy({ id });
  }

  async getPaginatedSites(
    pageNumber: number,
    pageSize: number,
  ): Promise<ISite[]> {
    try {
      const sites = await this.siteRepository.find({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        relations: { organization: true },
        select: {
          organization: {
            id: true,
            name: true,
          },
        },
      });

      if (sites.length === 0) {
        throw new NotFoundException('No sites found for the provided page');
      }

      return sites;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch sites',
        error.message,
      );
    }
  }
}
