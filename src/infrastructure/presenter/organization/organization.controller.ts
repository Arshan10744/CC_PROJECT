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
  ORGANIZATION_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { OrganizationDto } from './dto';
import { UpdateOrganizationDto } from './dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationUseCase } from 'src/usecases/organization.usecase';
import { IOrganization } from 'src/domain/models/organization';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/utilities/constants';
import { Action } from 'src/infrastructure/utilities/enums';
import { organizations } from 'src/infrastructure/orm/entities/organization.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/infrastructure/utilities/pagination.dto';

@Controller('/api/organization')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROXY)
    private readonly organizationUseCase: UseCaseProxy<OrganizationUseCase>,
  ) {}

  @CheckAbilities({ action: Action.Create, subjects: organizations })
  @Post('/')
  async create(@Body() payload: OrganizationDto): Promise<string> {
    return this.organizationUseCase.getInstance().create(payload);
  }

  @CheckAbilities({ action: Action.Update, subjects: organizations })
  @Put('/:id')
  async update(
    @Body() payload: UpdateOrganizationDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.organizationUseCase.getInstance().update(payload, id);
  }

  @CheckAbilities({ action: Action.Delete, subjects: organizations })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.organizationUseCase.getInstance().delete(id);
  }

  @CheckAbilities({ action: Action.Read, subjects: organizations })
  @Get('/')
  async getAll(@Req() req): Promise<IOrganization[]> {
    const userId = req.user.id;
    return this.organizationUseCase.getInstance().getAll(userId);
  }

  @CheckAbilities({ action: Action.Read, subjects: organizations })
  @Get('/paginated')
  async getPaginatedOrganizations(@Query() query: PaginationDto) {
    return this.organizationUseCase
      .getInstance()
      .getPaginatedOrganizations(query.pageNumber, query.pageSize);
  }
}
