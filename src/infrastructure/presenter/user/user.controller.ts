import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  UseCaseProxy,
  USER_USECASE_PROXY,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { UserUseCase } from 'src/usecases/user.usecase';
import { UserDto } from './dto';
import { UpdateUserDto } from './update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUser } from 'src/domain/models/user';

@Controller('/api/user')
// @UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROXY)
    private readonly userUseCase: UseCaseProxy<UserUseCase>,
  ) {}

  @Post('/')
  async create(@Body() payload: UserDto): Promise<string> {
    return this.userUseCase.getInstance().create(payload);
  }

  @Put('/:id')
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.userUseCase.getInstance().update(payload, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userUseCase.getInstance().delete(id);
  }

  @Get('/')
  async getAll(): Promise<IUser[]> {
    return this.userUseCase.getInstance().getAll();
  }

  @Get('/company/:id')
  async getAllByCompanyId(@Param('id') id: string): Promise<IUser[]> {
    return this.userUseCase.getInstance().getByCompanyId(id);
  }
}
