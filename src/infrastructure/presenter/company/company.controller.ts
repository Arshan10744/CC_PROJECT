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
  COMPANY_USECASE_PROXY,
  ORGANIZATION_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CompanyUseCase } from 'src/usecases/company.usecase';
import { CompanyDto } from './dto';
import { UpdateCompanyDto } from './update.dto';
import { ICompany } from 'src/domain/models/company';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/guard/casl/casl.decorator';
import { Action } from 'src/infrastructure/utilities/enums';
import { combineLatest } from 'rxjs';
import { companies } from 'src/infrastructure/orm/entities/comapny.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/company')
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
  constructor(
    @Inject(COMPANY_USECASE_PROXY)
    private readonly companyUseCase: UseCaseProxy<CompanyUseCase>,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subjects: companies })
  @Post('/')
  async create(@Body() payload: CompanyDto): Promise<string> {
    return this.companyUseCase.getInstance().create(payload);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Update, subjects: companies })
  @Put('/:id')
  async update(
    @Body() payload: UpdateCompanyDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.companyUseCase.getInstance().update(payload, id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subjects: companies })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyUseCase.getInstance().delete(id);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subjects: companies })
  @Get('/')
  async getAll(): Promise<ICompany[]> {
    return this.companyUseCase.getInstance().getAll();
  }
}
