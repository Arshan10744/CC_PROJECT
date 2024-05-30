import { InferSubjects } from "@casl/ability";
import { organizations } from "../orm/entities/organization.entity";
import { users } from "../orm/entities/user.entity";
import { companies } from "../orm/entities/comapny.entity";
import { sites } from "../orm/entities/site.entity";
import { RequiredRule } from "src/domain/models/casl-requiredrule";
import { SetMetadata } from "@nestjs/common";

export type Subjects = | InferSubjects< typeof organizations | typeof users | typeof companies | typeof sites> | 'all';
export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements);