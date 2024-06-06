import { CompanyPresenter } from './../company/company.presenter';
import { Exclude, Expose, Type } from 'class-transformer';
import { SitePresenter } from '../site/site.presenter';
import { UserPresenter } from '../user/user.presenter';

export class OrganizationPresenter {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => SitePresenter)
  @Expose()
  sites: SitePresenter[];

  @Type(() => CompanyPresenter)
  @Expose()
  company: CompanyPresenter;

  @Type(() => UserPresenter)
  @Expose()
  users: UserPresenter[];
}
