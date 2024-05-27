import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CompanyDto {
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
  organizations?: string[];
}
