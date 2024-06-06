import { DeleteResult, UpdateResult } from 'typeorm';
import { IOrganization } from '../models/organization';

export interface IOrganizationRepository {
  create(payload: Partial<IOrganization>): Promise<string>;
  delete(id: string): Promise<DeleteResult>;
  getAll(userId: string): Promise<IOrganization[]>;
  update(payload: Partial<IOrganization>, id: string): Promise<UpdateResult>;
  getById(id: string): Promise<IOrganization>;
  getPaginatedOrganizations(
    pageNumber: number,
    pageSize: number,
  ): Promise<IOrganization[]>;

  getByCompanyId(id: string): Promise<IOrganization[]>;
  getByUserId(id: string): Promise<IOrganization[]>;
  getBySiteId(id: string): Promise<IOrganization[]>;
}
