export interface IJwt {
  createToken(payload: any, secret: string, expiresIn: string): string;
}
