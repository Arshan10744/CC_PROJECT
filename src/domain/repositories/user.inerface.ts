import { DeleteResult, UpdateResult } from 'typeorm';
import { IUser } from '../models/user';

export interface IUserRepository {
  create(payload: Partial<IUser>): Promise<string>;
  delete(id: string): Promise<DeleteResult>;
  getAll(user: IUser): Promise<Partial<IUser[]>>;
  update(payload: Partial<IUser>, id: string): Promise<UpdateResult>;
  getById(id: string): Promise<IUser>;
  getByCompanyId(id: string): Promise<IUser[]>;
  getByEmail(email: string): Promise<IUser>;
  getPaginatedUsers(pageNumber: number, pageSize: number): Promise<IUser[]>;
  updatePassword(userId: string, hash: string): Promise<UpdateResult>;
}
