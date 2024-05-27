import { users } from '../entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { organizations } from '../entities/organization.entity';
import { companies } from '../entities/comapny.entity';
import { sites } from '../entities/site.entity';
import { UserRepository } from './user.repository';
import { CompanyRepository } from './company.repository';
import { OrganizationRepository } from './organization.repository';
import { BcryptService } from 'src/infrastructure/services/bcrypt.service';
import { SiteRepository } from './site.repository';
import { AuthRepository } from './auth.repository';
import { JwtTokenService } from 'src/infrastructure/services/jwt.service';
import { QrcodeService } from 'src/infrastructure/services/qrcode.service';
import { SpeakeasyService } from 'src/infrastructure/services/speakeasy.service';
import { CaslAbilityFactory } from 'src/infrastructure/services/ability.service';

@Module({
  imports: [TypeOrmModule.forFeature([users, organizations, companies, sites])],
  providers: [
    UserRepository,
    CompanyRepository,
    OrganizationRepository,
    SiteRepository,
    AuthRepository,
    BcryptService,
    JwtTokenService,
    QrcodeService,
    SpeakeasyService,
    CaslAbilityFactory,
  ],
  exports: [
    UserRepository,
    CompanyRepository,
    OrganizationRepository,
    SiteRepository,
    AuthRepository,
    BcryptService,
    JwtTokenService,
    QrcodeService,
    SpeakeasyService,
    CaslAbilityFactory,
  ],
})
export class RepositoriesModule {}
