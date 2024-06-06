import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class SiteDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly organization: string;
}

export class UpdateSiteDto extends PartialType(
  OmitType(SiteDto, ['organization'] as const),
) {}
