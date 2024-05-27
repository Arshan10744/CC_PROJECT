import { UserRole } from 'src/infrastructure/utilities/enums';
import { IOrganization } from './organization';
import { ICompany } from './company';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  company?: Partial<ICompany>;
  organizations?: Partial<IOrganization[]>;
}
