import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  SITE_USECASE_PROXY,
  UseCaseProxy,
  USER_USECASE_PROXY,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { UserUseCase } from 'src/usecases/user.usecase';
import { SiteDto } from './dto';
import { UpdateSiteDto } from './update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { users } from 'src/infrastructure/orm/entities/user.entity';
import { IUser } from 'src/domain/models/user';
import { SiteUseCase } from 'src/usecases/site.usecase';
import { ISite } from 'src/domain/models/site';

@Controller('/api/site')
export class SiteController {
  constructor(
    @Inject(SITE_USECASE_PROXY)
    private readonly siteUseCase: UseCaseProxy<SiteUseCase>,
  ) {}

  @Post('/')
  async create(@Body() payload: SiteDto): Promise<string> {
    return this.siteUseCase.getInstance().create(payload);
  }

  @Put('/:id')
  async update(
    @Body() payload: UpdateSiteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.siteUseCase.getInstance().update(payload, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.siteUseCase.getInstance().delete(id);
  }

  @Get('/')
  async getAll(): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAll();
  }

  @Get('/organization/:id')
  async getAllByOrgId(@Param('id') id: string): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAllByOrganizationId(id);
  }

  @Get('/company/:id')
  async getAllByCompanyId(@Param('id') id: string): Promise<ISite[]> {
    return this.siteUseCase.getInstance().getAllByCompanyId(id);
  }
}
