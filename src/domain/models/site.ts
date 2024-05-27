import { IOrganization } from './organization';

export interface ISite {
  id: string;
  name: string;
  organization?: Partial<IOrganization>;
}
