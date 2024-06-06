import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';
import { OrganizationPresenter } from '../organization/organization.presenter';

export class SitePresenter {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => OrganizationPresenter)
  @Expose()
  organization: OrganizationPresenter;
}
