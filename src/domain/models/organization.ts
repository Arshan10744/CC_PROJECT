import { sites } from 'src/infrastructure/orm/entities/site.entity';
import { ICompany } from './company';
import { IUser } from './user';

export interface IOrganization {
  id: string;
  name: string;
  sites?: Partial<sites[]>;
  company?: Partial<ICompany>;
  users?: Partial<IUser[]>;
}
