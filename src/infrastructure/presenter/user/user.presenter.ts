import { Exclude, Expose, Type } from 'class-transformer';
import { CompanyPresenter } from '../company/company.presenter';
import { OrganizationPresenter } from '../organization/organization.presenter';
import { UserRole } from 'src/infrastructure/utilities/enums';

export class UserPresenter {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  role: UserRole;

  @Expose()
  email: string;

  @Type(() => CompanyPresenter)
  @Expose()
  company: CompanyPresenter;

  @Type(() => OrganizationPresenter)
  @Expose()
  organizations: OrganizationPresenter[];

  @Exclude()
  password: string;

  @Exclude()
  is2faAuthenticated: boolean;
}
