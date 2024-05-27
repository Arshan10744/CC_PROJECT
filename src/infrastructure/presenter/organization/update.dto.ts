import { PartialType } from '@nestjs/swagger';
import { OrganizationDto } from './dto';

export class UpdateOrganizationDto extends PartialType(OrganizationDto) {}
