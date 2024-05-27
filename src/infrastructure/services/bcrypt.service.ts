import { Injectable } from '@nestjs/common';
import { IBcrypt } from 'src/domain/services/bcrypt.interface';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptService implements IBcrypt {
  constructor(private readonly configService: ConfigService) {}
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      parseInt(this.configService.get('ROUNDS')),
    );

    const hashPass = await bcrypt.hash(password, salt);
    return hashPass;
  }

  async compare(password: string, hashedPassword: string): Promise<any> {
    return bcrypt.compare(password, hashedPassword);
  }
}
