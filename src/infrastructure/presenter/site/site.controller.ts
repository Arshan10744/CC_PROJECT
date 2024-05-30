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
  SITE_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { SiteDto } from './dto';
import { UpdateSiteDto } from './update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SiteUseCase } from 'src/usecases/site.usecase';
import { ISite } from 'src/domain/models/site';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/utilities/constants';
import { Action } from 'src/infrastructure/utilities/enums';
import { sites } from 'src/infrastructure/orm/entities/site.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/infrastructure/utilities/pagination.dto';

@Controller('/api/site')
@UseGuards(AuthGuard('jwt'))
export class SiteController {
  constructor(
    @Inject(SITE_USECASE_PROXY)
    private readonly siteUseCase: UseCaseProxy<SiteUseCase>,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subjects: sites })
  @Post('/')
  async create(@Body() payload: SiteDto): Promise<string> {
    return this.siteUseCase.getInstance().create(payload);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Update, subjects: sites })
  @Put('/:id')
  async update(
    @Body() payload: UpdateSiteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.siteUseCase.getInstance().update(payload, id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subjects: sites })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.siteUseCase.getInstance().delete(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: sites })
  @Get('/')
  async getAll(): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAll();
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: sites })
  @Get('/organization/:id')
  async getAllByOrgId(@Param('id') id: string): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAllByOrganizationId(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: sites })
  @Get('/company/:id')
  async getAllByCompanyId(@Param('id') id: string): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAllByCompanyId(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: sites })
  @Get('/paginated')
  async getPaginatedSites(@Query() query: PaginationDto) {
    return this.siteUseCase
      .getInstance()
      .getPaginatedSites(query.pageNumber, query.pageSize);
  }
}
