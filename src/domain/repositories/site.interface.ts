import { DeleteResult, UpdateResult } from 'typeorm';
import { ISite } from '../models/site';
import { IUser } from '../models/user';

export interface ISiteRepository {
  create(payload: Partial<ISite>): Promise<string>;
  delete(id: string): Promise<DeleteResult>;
  getAll(user: Partial<IUser>): Promise<ISite[]>;
  update(payload: Partial<ISite>, id: string): Promise<UpdateResult>;
  getById(id: string): Promise<ISite>;
  getAllByOrganizationId(id: string): Promise<ISite[]>;
  getAllByCompanyId(id: string): Promise<ISite[]>;
  getPaginatedSites(pageNumber: number, pageSize: number): Promise<ISite[]>;
}
