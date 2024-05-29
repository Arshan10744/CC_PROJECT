import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IOrganizationRepository } from 'src/domain/repositories/organization.interface';
import { organizations } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(organizations)
    private readonly organizationRepository: Repository<organizations>,
  ) {}

  async create(payload: Partial<organizations>): Promise<string> {
    const organization = this.organizationRepository.create(payload);
    await this.organizationRepository.save(organization);
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

  async getAll(): Promise<organizations[]> {
    return this.organizationRepository.find({
      relations: { sites: true, company: true, users: true },
      select: {
        sites: {
          id: true,
          name: true,
        },
        company: {
          id: true,
          name: true,
        },
        users: {
          id: true,
          username: true,
          role: true,
          email: true,
        },
      },
    });
  }

  async save(payload: any) {
    this.organizationRepository.save(payload);
  }

  async getById(id: string): Promise<organizations> {
    return this.organizationRepository.findOneBy({ id });
  }

  async getPaginatedOrganizations(
    pageNumber: number,
    pageSize: number,
  ): Promise<organizations[]> {
    try {
      const organizations = await this.organizationRepository.find({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        relations: { sites: true, company: true, users: true },
        select: {
          sites: {
            id: true,
            name: true,
          },
          company: {
            id: true,
            name: true,
          },
          users: {
            id: true,
            username: true,
            role: true,
            email: true,
          },
        },
      });

      if (organizations.length === 0) {
        throw new NotFoundException(
          'No organizations found for the provided page',
        );
      }

      return organizations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch organizations',
        error.message,
      );
    }
  }
}
