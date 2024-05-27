export interface IQrcode {
  generateQRCode(otpAuthUrl: string): Promise<string>;
}
