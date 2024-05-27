import { DeleteResult, UpdateResult } from 'typeorm';
import { IOrganization } from '../models/organization';

export interface IOrganizationRepository {
  create(payload: Partial<IOrganization>): Promise<string>;
  delete(id: string): Promise<DeleteResult>;
  getAll(): Promise<IOrganization[]>;
  update(payload: Partial<IOrganization>, id: string): Promise<UpdateResult>;
  getById(id: string): Promise<IOrganization>;
}
