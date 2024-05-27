import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  IsArray,
} from 'class-validator';
import { UserRole } from 'src/infrastructure/utilities/enums';

export class UserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  // @Validate(IsUnique, ['users', 'email'])
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  role: UserRole;

  @IsString()
  @IsOptional()
  @ApiProperty()
  company?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  organizations?: string[];
}
