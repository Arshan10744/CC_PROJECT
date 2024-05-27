import { Injectable } from '@nestjs/common';
import { users } from '../orm/entities/user.entity';
import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { organizations } from '../orm/entities/organization.entity';
import { companies } from '../orm/entities/comapny.entity';
import { sites } from '../orm/entities/site.entity';
import { Action } from '../utilities/enums';

export type Subjects =
  | InferSubjects<
      typeof organizations | typeof users | typeof companies | typeof sites
    >
  | 'all';

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: users) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    if (user.role == 'admin') {
      can(Action.Manage, 'all');
    }

    if (user.role == 'user') {
      can(Action.Create, sites);
      can(Action.Read, sites);
      can(Action.Update, sites);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
