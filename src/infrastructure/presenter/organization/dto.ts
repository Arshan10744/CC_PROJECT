import { sites } from 'src/infrastructure/orm/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class OrganizationDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  users?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  sites?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  company?: string;
}
