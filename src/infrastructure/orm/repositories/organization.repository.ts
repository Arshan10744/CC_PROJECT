import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IOrganizationRepository } from 'src/domain/repositories/organization.interface';
import { IOrganization } from 'src/domain/models/organization';
import { plainToInstance } from 'class-transformer';
import { OrganizationPresenter } from 'src/infrastructure/presenter/organization/organization.presenter';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(organizations)
    private readonly organizationRepository: Repository<organizations>,
  ) {}

  async create(payload: Partial<organizations>): Promise<string> {
    console.log('Repository Payload-----', payload);
    const organization = this.organizationRepository.create(payload);
    console.log('Created Organization:---------------', organization);
    const savedOrganization =
      await this.organizationRepository.save(organization);
    console.log('Saved Orgnization', savedOrganization);
    return 'organization Created Successfully';
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.organizationRepository.delete({ id });
  }

  async update(
    payload: Partial<organizations>,
    id: string,
  ): Promise<UpdateResult> {
    return this.organizationRepository.update({ id }, payload);
  }

  async getAll(userId: string): Promise<Partial<IOrganization[]>> {
    const organizations = await this.organizationRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['sites', 'company', 'users'],
    });
    return plainToInstance(OrganizationPresenter, organizations, {
      excludeExtraneousValues: true,
    });
  }

  async save(payload: any) {
    this.organizationRepository.save(payload);
  }

  async getById(id: string): Promise<organizations> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async getByCompanyId(id: string): Promise<organizations[]> {
    return this.organizationRepository.find({
      where: {
        company: {
          id: id,
        },
      },
    });
  }

  async getByUserId(id: string): Promise<organizations[]> {
    return this.organizationRepository.find({
      where: {
        users: { id },
      },
    });
  }

  async getBySiteId(id: string): Promise<IOrganization[]> {
    return this.organizationRepository.find({
      where: { sites: { id } },
    });
  }

  async getPaginatedOrganizations(
    pageNumber: number,
    pageSize: number,
  ): Promise<organizations[]> {
    const organizations = await this.organizationRepository.find({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      relations: { sites: true, company: true, users: true },
    });
    return plainToInstance(OrganizationPresenter, organizations, {
      excludeExtraneousValues: true,
    });
  }
}
