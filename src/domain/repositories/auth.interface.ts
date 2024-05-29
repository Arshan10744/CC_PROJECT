import { IUser } from '../models/user';

export interface IAuthRepository {
  validate(email: string): Promise<IUser>;
}
