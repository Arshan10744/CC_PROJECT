import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { IQrcode } from 'src/domain/services/qrcode.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISpeakeasy } from 'src/domain/services/speakeasy.interface';

@Injectable()
export class SpeakeasyService implements ISpeakeasy {
  constructor(private readonly configService: ConfigService) {}

  getSecret(): { secret: any } {
    const genericSecret = this.configService.get<string>('GENERIC_SECRET');
    return {
      secret: {
        otpauthUrl: speakeasy.otpauthURL({
          secret: genericSecret,
          label: 'CC_PROJECT',
          encoding: 'base32',
        }),
      },
    };
  }
  async verifyToken(token: string): Promise<boolean> {
    const isVerified = speakeasy.totp.verify({
      secret: this.configService.get('GENERIC_SECRET'),
      encoding: 'base32',
      token,
    });
    return isVerified;
  }
}
