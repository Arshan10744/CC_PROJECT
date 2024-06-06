import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CompanyDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly users?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly organizations?: string[];
}

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
