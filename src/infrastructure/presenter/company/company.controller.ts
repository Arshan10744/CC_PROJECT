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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  COMPANY_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructure/usecaseproxy/usecase-proxy';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CompanyUseCase } from 'src/usecases/company.usecase';
import { CompanyDto, UpdateCompanyDto } from './dto';
import { ICompany } from 'src/domain/models/company';
import { AbilitiesGuard } from 'src/infrastructure/guard/casl/abilities.guard';
import { CheckAbilities } from 'src/infrastructure/utilities/constants';
import { Action } from 'src/infrastructure/utilities/enums';
import { companies } from 'src/infrastructure/orm/entities/comapny.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/infrastructure/utilities/pagination.dto';
import { ErrorInterceptor } from 'src/infrastructure/interceptors/error.interceptor';

@Controller('/api/company')
@UseInterceptors(ErrorInterceptor)
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class CompanyController {
  constructor(
    @Inject(COMPANY_USECASE_PROXY)
    private readonly companyUseCase: UseCaseProxy<CompanyUseCase>,
  ) {}

  @CheckAbilities({ action: Action.Create, subjects: companies })
  @Post('/')
  async create(@Body() payload: CompanyDto): Promise<string> {
    return this.companyUseCase.getInstance().create(payload);
  }

  @CheckAbilities({ action: Action.Update, subjects: companies })
  @Put('/:id')
  async update(
    @Body() payload: UpdateCompanyDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.companyUseCase.getInstance().update(payload, id);
  }

  @CheckAbilities({ action: Action.Delete, subjects: companies })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyUseCase.getInstance().delete(id);
  }

  @CheckAbilities({ action: Action.Read, subjects: companies })
  @Get('/')
  async getAll(): Promise<ICompany[]> {
    return this.companyUseCase.getInstance().getAll();
  }

  @CheckAbilities({ action: Action.Read, subjects: companies })
  @Get('/paginated')
  async getPaginatedCompanies(@Query() query: PaginationDto) {
    return this.companyUseCase
      .getInstance()
      .getPaginatedCompanies(query.pageNumber, query.pageSize);
  }
}
