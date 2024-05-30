import { Subjects } from "src/infrastructure/utilities/constants";
import { Action } from "src/infrastructure/utilities/enums";

export interface RequiredRule {
    action: Action;
    subjects: Subjects;
  }
  