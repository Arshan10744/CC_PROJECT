import { IUser } from '../models/user';

export interface IAuthRepository {
  validate(email: string): Promise<IUser>;
  enableTwoFactorAuth(id: string): Promise<any>;
  signup(payload: Partial<IUser>): Promise<string>;
}
