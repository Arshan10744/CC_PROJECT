import { IOrganization } from './organization';
import { IUser } from './user';

export interface ICompany {
  id: string;
  name: string;
  users?: Partial<IUser[]>;
  organizations?: Partial<IOrganization[]>;
}
