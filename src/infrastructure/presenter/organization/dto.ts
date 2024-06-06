import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class OrganizationDto {
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
  readonly sites?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly company: string;
}

export class UpdateOrganizationDto extends PartialType(
  OmitType(OrganizationDto, ['company'] as const),
) {}
