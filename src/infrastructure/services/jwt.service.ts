import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IJwt } from 'src/domain/services/jwt.interface';

@Injectable()
export class JwtTokenService implements IJwt {
  createToken(payload: any, secret: string, expiresIn: string): string {
    return jwt.sign(payload, secret, { expiresIn });
  }
}
