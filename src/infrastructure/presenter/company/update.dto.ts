import { PartialType } from '@nestjs/swagger';
import { CompanyDto } from './dto';

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
