import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { SpeakeasyService } from './../infrastructure/services/speakeasy.service';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from 'src/infrastructure/presenter/auth/dto';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { JwtTokenService } from 'src/infrastructure/services/jwt.service';
import { BcryptService } from 'src/infrastructure/services/bcrypt.service';
import { AuthRepository } from 'src/infrastructure/orm/repositories/auth.repository';
import { QrcodeService } from 'src/infrastructure/services/qrcode.service';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { UserDto } from 'src/infrastructure/presenter/user/dto';
import { CompanyRepository } from 'src/infrastructure/orm/repositories/company.repository';
import { OrganizationRepository } from 'src/infrastructure/orm/repositories/organization.repository';

export class AuthUseCase {
  constructor(
    private readonly companyService: CompanyRepository,
    private readonly organizationService: OrganizationRepository,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly qrCodeService: QrcodeService,
    private readonly speakeasyService: SpeakeasyService,
  ) {}

  async validate(payload: AuthDto): Promise<any> {
    const { email, password } = payload;
    const user = await this.authRepository.validate(email);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const passwordMatch = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!passwordMatch) {
      throw new NotFoundException('Invalid credentials');
    }

    const jwtPayload = {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    if (user.is2faAuthenticated) {
      return {
        version: 'This token is for 2FA',
        access_token: this.jwtTokenService.createToken(
          jwtPayload,
          this.configService.get('JWT_SECRET_2FA'),
          this.configService.get('JWT_EXPIRATION_TIME_2FA'),
        ),
      };
    }

    const { secret } = this.speakeasyService.getSecret();
    const qrCodeUrl = await this.qrCodeService.generateQRCode(
      secret.otpauthUrl,
    );

    return {
      version: 'This token is for 2FA',
      access_token: this.jwtTokenService.createToken(
        jwtPayload,
        this.configService.get('JWT_SECRET_2FA'),
        this.configService.get('JWT_EXPIRATION_TIME_2FA'),
      ),
      qrCodeUrl: qrCodeUrl,
    };
  }

  async signUp(payload: Partial<UserDto>) {
    let { organizations, company, ...userPayload } = payload;

    let companyValue;
    let organizationsValue = [];

    if (company !== undefined && company !== '') {
      const existingCompany = await this.companyService.getById(
        company.toString(),
      );
      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      companyValue = { id: existingCompany.id };
    } else {
      companyValue = null;
    }

    if (organizations?.length) {
      organizationsValue = await Promise.all(
        organizations.map(
          async (id) => await this.organizationService.getById(id),
        ),
      );
      if (organizationsValue.some((organization) => !organization)) {
        throw new NotFoundException('One or more organization not found');
      }
    }

    const hash = await this.bcryptService.hash(payload.password);
    userPayload.password = hash;

    return await this.authRepository.signup({
      company: companyValue,
      organizations: organizationsValue,
      ...userPayload,
    });
  }

  async verifyToken(token: string, userPayload: Partial<users>): Promise<any> {
    const user = await this.userRepository.getById(userPayload.id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const verifiedToken = await this.speakeasyService.verifyToken(token);

    if (!verifiedToken) {
      return {
        error: 'The token is invalid...',
      };
    } else {
      const { id, role, username, email } = userPayload;
      const payload = { id, role, username, email };
      const access_token = this.jwtTokenService.createToken(
        payload,
        this.configService.get('JWT_SECRET'),
        this.configService.get('JWT_EXPIRATION_TIME'),
      );

      if (!user.is2faAuthenticated) {
        await this.authRepository.enableTwoFactorAuth(id);
      }
      return { access_token: access_token };
    }
  }
}
