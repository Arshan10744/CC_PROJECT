import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  pageNumber: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pageSize: number;
}
