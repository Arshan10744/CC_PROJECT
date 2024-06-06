import { UserRole } from 'src/infrastructure/utilities/enums';
import { IOrganization } from './organization';
import { ICompany } from './company';

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  company: Partial<Partial<ICompany>>;
  organizations?: Partial<IOrganization[]>;
}

export interface IUserWithPassword extends IUser {
  password: string;
}
