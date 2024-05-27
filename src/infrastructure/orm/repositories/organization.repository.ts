import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ICompanyRepository } from 'src/domain/repositories/company.interface';
import { companies } from '../entities/comapny.entity';
import { IOrganizationRepository } from 'src/domain/repositories/organization.interface';
import { organizations } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(organizations)
    private readonly organizationRepository: Repository<organizations>,
  ) {}

  async create(payload: Partial<organizations>): Promise<string> {
    await this.organizationRepository.save(payload);
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
}
