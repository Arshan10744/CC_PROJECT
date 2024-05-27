export interface ISpeakeasy {
  getSecret(): { secret: any };
  verifyToken(token: string): Promise<boolean>;
}
