import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { Injectable } from '@nestjs/common';
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
    await this.siteRepository.save(payload);
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
}
