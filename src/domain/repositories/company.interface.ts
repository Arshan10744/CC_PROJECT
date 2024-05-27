import { DeleteResult, UpdateResult } from 'typeorm';
import { ICompany } from '../models/company';

export interface ICompanyRepository {
  create(payload: Partial<ICompany>): Promise<string>;
  delete(id: string): Promise<DeleteResult>;
  getAll(): Promise<ICompany[]>;
  update(payload: Partial<ICompany>, id: string): Promise<UpdateResult>;
  getById(id: string): Promise<ICompany>;
}
