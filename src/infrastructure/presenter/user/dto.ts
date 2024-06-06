import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  IsArray,
} from 'class-validator';
import { UserRole } from 'src/infrastructure/utilities/enums';
import { PartialType } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  // @Validate(IsUnique, ['users', 'email'])
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  readonly role: UserRole;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly company: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly organizations?: string[];
}

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['password', 'email', 'company'] as const),
) {}

export class updatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
