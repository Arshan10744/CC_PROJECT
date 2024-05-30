import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/utilities/constants';
import { Action } from 'src/infrastructure/utilities/enums';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { PaginationDto } from 'src/infrastructure/utilities/pagination.dto';

@Controller('/api/user')
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROXY)
    private readonly userUseCase: UseCaseProxy<UserUseCase>,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(@Body() payload: UserDto): Promise<string> {
    return this.userUseCase.getInstance().create(payload);
  }

  @Post('/signUp')
  async signUp(@Body() payload: UserDto): Promise<string> {
    return this.userUseCase.getInstance().signUp(payload);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Update, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.userUseCase.getInstance().update(payload, id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userUseCase.getInstance().delete(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAll(): Promise<IUser[]> {
    return this.userUseCase.getInstance().getAll();
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Get('/company/:id')
  async getAllByCompanyId(@Param('id') id: string): Promise<IUser[]> {
    return this.userUseCase.getInstance().getByCompanyId(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: users })
  @UseGuards(AuthGuard('jwt'))
  @Get('/paginated')
  async getPaginatedUser(@Query() query: PaginationDto) {
    return this.userUseCase
      .getInstance()
      .getPaginatedUsers(query.pageNumber, query.pageSize);
  }
}
