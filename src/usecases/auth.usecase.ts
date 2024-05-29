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

export class AuthUseCase {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly authRepository: AuthRepository,
    private readonly qrCodeService: QrcodeService,
    private readonly userRepository: UserRepository,
    private readonly speakeasyService: SpeakeasyService,
  ) {}

  async validate(payload: AuthDto): Promise<any> {
    try {
      const { email, password } = payload;
      console.log(email, password);
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
    } catch (error) {
      return error.message;
    }
  }

  async validate2FA(payload: AuthDto): Promise<any> {
    try {
      const { email, password } = payload;
      console.log(email, password);
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
    } catch (error) {
      return error.message;
    }
  }

  async verifyToken(token: string, userPayload: Partial<users>): Promise<any> {
    try {
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
          await this.userRepository.enableTwoFactorAuth(id);
        }
        return { access_token: access_token };
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return {
        error: 'An error occurred while verifying the token...',
      };
    }
  }
}
