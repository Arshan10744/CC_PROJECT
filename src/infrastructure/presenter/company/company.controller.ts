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
  COMPANY_USECASE_PROXY,
  ORGANIZATION_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CompanyUseCase } from 'src/usecases/company.usecase';
import { CompanyDto } from './dto';
import { UpdateCompanyDto } from './update.dto';
import { ICompany } from 'src/domain/models/company';

@Controller('/api/company')
export class CompanyController {
  constructor(
    @Inject(COMPANY_USECASE_PROXY)
    private readonly companyUseCase: UseCaseProxy<CompanyUseCase>,
  ) {}

  @Post('/')
  async create(@Body() payload: CompanyDto): Promise<string> {
    return this.companyUseCase.getInstance().create(payload);
  }

  @Put('/:id')
  async update(
    @Body() payload: UpdateCompanyDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.companyUseCase.getInstance().update(payload, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyUseCase.getInstance().delete(id);
  }

  @Get('/')
  async getAll(): Promise<ICompany[]> {
    return this.companyUseCase.getInstance().getAll();
  }
}
