import * as qrcode from 'qrcode';
import { IQrcode } from 'src/domain/services/qrcode.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QrcodeService implements IQrcode {
  constructor() {}

  async generateQRCode(otpAuthUrl: string) {
    try {
      const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);
      return qrCodeUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }
}
