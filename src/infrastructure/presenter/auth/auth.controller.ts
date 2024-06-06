import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  AUTH_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { AuthUseCase } from 'src/usecases/auth.usecase';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../user/dto';
import { ErrorInterceptor } from 'src/infrastructure/interceptors/error.interceptor';

@Controller('/api/auth')
// @UseInterceptors(ErrorInterceptor)
export class AuthController {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUseCase: UseCaseProxy<AuthUseCase>,
  ) {}

  @Post('/signUp')
  async signUp(@Body() payload: UserDto): Promise<string> {
    return this.authUseCase.getInstance().signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signIn')
  async signIn(@Body() credentials: AuthDto): Promise<string> {
    return this.authUseCase.getInstance().validate(credentials);
  }

  @UseGuards(AuthGuard('jwt-2fa'))
  @Post('/verifyToken')
  async verifyToken(@Body('token') token: string, @Req() req) {
    const user = req.user;
    return this.authUseCase.getInstance().verifyToken(token, user);
  }
}
