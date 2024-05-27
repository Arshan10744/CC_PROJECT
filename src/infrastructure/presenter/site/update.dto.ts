import { SiteDto } from './dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSiteDto extends PartialType(SiteDto) {}
