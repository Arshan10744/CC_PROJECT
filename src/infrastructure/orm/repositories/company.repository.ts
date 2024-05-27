import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IUserRepository } from 'src/domain/repositories/user.inerface';
import { users } from '../entities/user.entity';
import { IUser } from 'src/domain/models/user';
import { ICompanyRepository } from 'src/domain/repositories/company.interface';
import { companies } from '../entities/comapny.entity';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(companies)
    private readonly companyRepository: Repository<companies>,
  ) {}

  async create(payload: Partial<companies>): Promise<string> {
    await this.companyRepository.save(payload);
    return 'company Created Successfully';
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.companyRepository.delete({ id });
  }

  async update(payload: Partial<companies>, id: string): Promise<UpdateResult> {
    return this.companyRepository.update({ id }, payload);
  }

  async getAll(): Promise<companies[]> {
    return this.companyRepository.find({
      relations: { organizations: true, users: true },
    });
  }

  async save(payload: any) {
    this.companyRepository.save(payload);
  }

  async getById(id: string): Promise<companies> {
    return this.companyRepository.findOneBy({ id });
  }
}
