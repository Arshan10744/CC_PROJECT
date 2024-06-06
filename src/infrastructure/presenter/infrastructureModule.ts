import { UserController } from './user/user.controller';
import { Module } from '@nestjs/common';
import { UseCaseModule } from '../usecaseproxy/usecase-module';
import { SiteController } from './site/site.controller';
import { OrganizationController } from './organization/organization.controller';
import { CompanyController } from './company/company.controller';
import { AuthController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Jwt2faStrategy } from '../strategies/jwt2fa.stratgey';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AbilitiesGuard } from '../guard/casl/abilities.guard';
import { CaslAbilityFactory } from '../services/ability.service';
import { RepositoriesModule } from '../orm/repositories/repositories.module';

@Module({
  imports: [
    UseCaseModule.register(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_2FA'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME_2FA'),
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    RepositoriesModule,
  ],
  controllers: [
    UserController,
    SiteController,
    OrganizationController,
    CompanyController,
    AuthController,
  ],
  providers: [Jwt2faStrategy, JwtStrategy, AbilitiesGuard, CaslAbilityFactory],
  exports: [Jwt2faStrategy, JwtStrategy, AbilitiesGuard, CaslAbilityFactory],
})
export class InfrastructureControllerModule {}
