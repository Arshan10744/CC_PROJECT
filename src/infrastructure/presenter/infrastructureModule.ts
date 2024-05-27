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
// import { CarController } from './car-presenter/controller';
// import { CatController } from './cat-presenter/controller';
// import { GroupController } from './group-presenter/controller';
// import { DepartmentController } from './department-presenter/controller';
// import { AuthController } from './auth-presenter/controller';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from '../strategies/auth/jwt.stratgy';
// import { Jwt2faStrategy } from '../strategies/auth/2fa.jwt.startegy';

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
  ],
  controllers: [
    UserController,
    SiteController,
    OrganizationController,
    CompanyController,
    AuthController,
  ],
  providers: [Jwt2faStrategy, JwtStrategy],
  exports: [Jwt2faStrategy,  JwtStrategy],
})
export class InfrastructureControllerModule {}
