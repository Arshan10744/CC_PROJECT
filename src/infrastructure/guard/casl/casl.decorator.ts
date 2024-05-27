import { SetMetadata } from '@nestjs/common';
import { Subjects } from 'src/infrastructure/services/ability.service';
import { Action } from 'src/infrastructure/utilities/enums';

export interface RequiredRule {
  action: Action;
  subjects: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
