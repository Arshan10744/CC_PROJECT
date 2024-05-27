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
  ORGANIZATION_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { UserUseCase } from 'src/usecases/user.usecase';
import { OrganizationDto } from './dto';
import { UpdateOrganizationDto } from './update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrganizationUseCase } from 'src/usecases/organization.usecase';
import { IOrganization } from 'src/domain/models/organization';

@Controller('/api/organization')
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROXY)
    private readonly organizationUseCase: UseCaseProxy<OrganizationUseCase>,
  ) {}

  @Post('/')
  async create(@Body() payload: OrganizationDto): Promise<string> {
    return this.organizationUseCase.getInstance().create(payload);
  }

  @Put('/:id')
  async update(
    @Body() payload: UpdateOrganizationDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.organizationUseCase.getInstance().update(payload, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.organizationUseCase.getInstance().delete(id);
  }

  @Get('/')
  async getAll(): Promise<IOrganization[]> {
    return this.organizationUseCase.getInstance().getAll();
  }
}
