export const USER_USECASE_PROXY: string = 'USERUSERCASEPROXY';
export const SITE_USECASE_PROXY: string = 'SITEUSECASEPROXY';
export const ORGANIZATION_USECASE_PROXY: string = 'ORGANIZATIONUSECASEPROXY';
export const COMPANY_USECASE_PROXY: string = 'COMPANYUSECASEPROXY';
export const AUTH_USECASE_PROXY: string = 'AUTHUSECASEPROXY';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}
