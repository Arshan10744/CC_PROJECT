import * as speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISpeakeasy } from 'src/domain/services/speakeasy.interface';

@Injectable()
export class SpeakeasyService implements ISpeakeasy {
  constructor(private readonly configService: ConfigService) {}

  getSecret(): { secret: any } {
    const SpeakeasySecret = this.configService.get<string>('SPEAKEASY_SECRET');
    return {
      secret: {
        otpauthUrl: speakeasy.otpauthURL({
          secret: SpeakeasySecret,
          label: 'CC_PROJECT',
          encoding: 'base32',
        }),
      },
    };
  }
  async verifyToken(token: string): Promise<boolean> {
    const isVerified = speakeasy.totp.verify({
      secret: this.configService.get('SPEAKEASY_SECRET'),
      encoding: 'base32',
      token,
    });
    return isVerified;
  }
}
