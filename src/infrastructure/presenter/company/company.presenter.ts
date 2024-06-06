import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';
import { OrganizationPresenter } from '../organization/organization.presenter';
import { UserPresenter } from '../user/user.presenter';

export class CompanyPresenter {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => OrganizationPresenter)
  @Expose()
  organizations: OrganizationPresenter[];

  @Type(() => UserPresenter)
  @Expose()
  users: UserPresenter[];
}
