import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  UseCaseProxy,
  USER_USECASE_PROXY,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { UserUseCase } from 'src/usecases/user.usecase';
import { UserDto, UpdateUserDto, updatePasswordDto } from './dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUser } from 'src/domain/models/user';
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/utilities/constants';
import { Action } from 'src/infrastructure/utilities/enums';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { PaginationDto } from 'src/infrastructure/utilities/pagination.dto';

@Controller('/api/user')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROXY)
    private readonly userUseCase: UseCaseProxy<UserUseCase>,
  ) {}

  @CheckAbilities({ action: Action.Create, subjects: users })
  @Post('/')
  async create(@Body() payload: UserDto): Promise<string> {
    return this.userUseCase.getInstance().create(payload);
  }

  @CheckAbilities({ action: Action.Update, subjects: users })
  @Put('/:id')
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.userUseCase.getInstance().update(payload, id);
  }

  @CheckAbilities({ action: Action.Delete, subjects: users })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userUseCase.getInstance().delete(id);
  }

  @CheckAbilities({ action: Action.Read, subjects: users })
  @Get('/')
  async getAll(@Req() req): Promise<IUser[]> {
    const userId = req.user.id;
    return this.userUseCase.getInstance().getAll(userId);
  }

  @CheckAbilities({ action: Action.Read, subjects: users })
  @Get('/company/:id')
  async getAllByCompanyId(@Param('id') id: string): Promise<IUser[]> {
    return this.userUseCase.getInstance().getByCompanyId(id);
  }

  @CheckAbilities({ action: Action.Read, subjects: users })
  @Get('/paginated')
  async getPaginatedUser(@Query() query: PaginationDto) {
    return this.userUseCase
      .getInstance()
      .getPaginatedUsers(query.pageNumber, query.pageSize);
  }

  @Put('/updatePassword/:id')
  @CheckAbilities({ action: Action.Update, subjects: users })
  async updatePassword(
    @Body() password: updatePasswordDto,
    @Param('id') id: string,
  ) {
    return this.userUseCase.getInstance().updatePassword(id, password);
  }
}
