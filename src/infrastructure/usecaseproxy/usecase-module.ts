import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { Module, DynamicModule } from '@nestjs/common';
import { UserUseCase } from 'src/usecases/user.usecase';
import { RepositoriesModule } from '../orm/repositories/repositories.module';

import {
  AUTH_USECASE_PROXY,
  COMPANY_USECASE_PROXY,
  ORGANIZATION_USECASE_PROXY,
  SITE_USECASE_PROXY,
  USER_USECASE_PROXY,
  UseCaseProxy,
} from './usecase-proxy';
import { BcryptService } from '../services/bcrypt.service';
import { OrganizationRepository } from '../orm/repositories/organization.repository';
import { SiteRepository } from '../orm/repositories/site.repository';
import { SiteUseCase } from 'src/usecases/site.usecase';
import { OrganizationUseCase } from 'src/usecases/organization.usecase';
import { CompanyUseCase } from 'src/usecases/company.usecase';
import { users } from '../orm/entities/user.entity';
import { JwtTokenService } from '../services/jwt.service';
import { AuthRepository } from '../orm/repositories/auth.repository';
import { AuthUseCase } from 'src/usecases/auth.usecase';
import { QrcodeService } from '../services/qrcode.service';
import { SpeakeasyService } from '../services/speakeasy.service';

@Module({
  imports: [RepositoriesModule],
})
export class UseCaseModule {
  static register(): DynamicModule {
    return {
      module: UseCaseModule,
      providers: [
        {
          inject: [
            AuthRepository,
            BcryptService,
            JwtTokenService,
            ConfigService,
            QrcodeService,
            UserRepository,
            SpeakeasyService,
          ],
          provide: AUTH_USECASE_PROXY,
          useFactory: (
            authRepository: AuthRepository,
            bcryptService: BcryptService,
            jwtTokenService: JwtTokenService,
            configService: ConfigService,
            qrCodeService: QrcodeService,
            userRepository: UserRepository,
            speakeasyService: SpeakeasyService,
          ) =>
            new UseCaseProxy(
              new AuthUseCase(
                bcryptService,
                configService,
                jwtTokenService,
                authRepository,
                qrCodeService,
                userRepository,
                speakeasyService,
              ),
            ),
        },

        {
          inject: [
            UserRepository,
            BcryptService,
            CompanyRepository,
            OrganizationRepository,
          ],
          provide: USER_USECASE_PROXY,
          useFactory: (
            userRepository: UserRepository,
            bcryptService: BcryptService,
            companyRepository: CompanyRepository,
            organizationRepository: OrganizationRepository,
          ) =>
            new UseCaseProxy(
              new UserUseCase(
                userRepository,
                companyRepository,
                organizationRepository,
                bcryptService,
              ),
            ),
        },

        {
          inject: [SiteRepository, OrganizationRepository, CompanyRepository],
          provide: SITE_USECASE_PROXY,
          useFactory: (
            siteRepository: SiteRepository,
            organizationRepository: OrganizationRepository,
            companyRepository: CompanyRepository,
          ) =>
            new UseCaseProxy(
              new SiteUseCase(
                siteRepository,
                organizationRepository,
                companyRepository,
              ),
            ),
        },

        {
          inject: [
            OrganizationRepository,
            CompanyRepository,
            UserRepository,
            SiteRepository,
          ],
          provide: ORGANIZATION_USECASE_PROXY,
          useFactory: (
            organizationRepository: OrganizationRepository,
            companyRepository: CompanyRepository,
            userRepository: UserRepository,
            siteRepository: SiteRepository,
          ) =>
            new UseCaseProxy(
              new OrganizationUseCase(
                organizationRepository,
                companyRepository,
                userRepository,
                siteRepository,
              ),
            ),
        },

        {
          inject: [CompanyRepository, UserRepository, OrganizationRepository],
          provide: COMPANY_USECASE_PROXY,
          useFactory: (
            companyRepository: CompanyRepository,
            userRepository: UserRepository,
            organizationRepository: OrganizationRepository,
          ) =>
            new UseCaseProxy(
              new CompanyUseCase(
                companyRepository,
                organizationRepository,
                userRepository,
              ),
            ),
        },
      ],
      exports: [
        USER_USECASE_PROXY,
        SITE_USECASE_PROXY,
        ORGANIZATION_USECASE_PROXY,
        COMPANY_USECASE_PROXY,
        AUTH_USECASE_PROXY,
      ],
    };
  }
}
