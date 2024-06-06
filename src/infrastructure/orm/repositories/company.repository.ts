import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ICompanyRepository } from 'src/domain/repositories/company.interface';
import { companies } from '../entities/comapny.entity';
import { ICompany } from 'src/domain/models/company';
import { plainToInstance } from 'class-transformer';
import { CompanyPresenter } from 'src/infrastructure/presenter/company/company.presenter';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(companies)
    private readonly companyRepository: Repository<companies>,
  ) {}

  async create(payload: Partial<companies>): Promise<string> {
    const company = this.companyRepository.create(payload);
    await this.companyRepository.save(company);
    return 'company Created Successfully';
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.companyRepository.delete({ id });
  }

  async update(payload: Partial<companies>, id: string): Promise<UpdateResult> {
    return this.companyRepository.update({ id }, payload);
  }

  async getAll(): Promise<Partial<companies[]>> {
    const companies = await this.companyRepository.find({
      relations: ['organizations', 'users'],
    });
    return plainToInstance(CompanyPresenter, companies, {
      excludeExtraneousValues: true,
    });
  }

  async save(payload: any) {
    this.companyRepository.save(payload);
  }

  async getById(id: string): Promise<companies> {
    return this.companyRepository.findOneBy({ id });
  }

  async getPaginatedCompanies(
    pageNumber: number,
    pageSize: number,
  ): Promise<ICompany[]> {
    const companies = await this.companyRepository.find({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      relations: { organizations: true, users: true },
    });
    return plainToInstance(CompanyPresenter, companies, {
      excludeExtraneousValues: true,
    });
  }
}
