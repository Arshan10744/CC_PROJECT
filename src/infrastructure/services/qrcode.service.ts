import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { IQrcode } from 'src/domain/services/qrcode.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrcodeService implements IQrcode {
  constructor(private readonly configService: ConfigService) {}

  async generateQRCode(otpAuthUrl: string) {
    try {
      const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);
      return qrCodeUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }
}
