import { Inject, Injectable } from '@nestjs/common';
import { users } from '../orm/entities/user.entity';
import {
  AbilityBuilder,
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { sites } from '../orm/entities/site.entity';
import { Action } from '../utilities/enums';
import { Subjects } from '../utilities/constants';
import { OrganizationRepository } from '../orm/repositories/organization.repository';

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly organizationService: OrganizationRepository) {}
  async defineAbility(request) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );
    console.log(request.method);

    if (request.user.role == 'admin') {
      can(Action.Manage, 'all');
    }
    if (request.user.role == 'user') {
      can(Action.Create, sites, {});
      can(Action.Read, sites, {});
    }

    if (request.originalUrl === '/api/sites/:id' && request.method === 'PUT') {
      const userOrganizations = await this.organizationService.getByUserId(
        request.user.id,
      );
      const userOrganizationIds = userOrganizations.map((org) => org.id);
      const siteOrganization = await this.organizationService.getBySiteId(
        request.params.id,
      );
      const siteOrganizationId = siteOrganization.map((org) => org.id);

      if (userOrganizationIds.includes(siteOrganizationId[0])) {
        can(Action.Update, sites);
      }
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
