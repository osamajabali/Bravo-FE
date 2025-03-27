import { PaginationFilter } from '../shared-models/pagination.model';

export class SingleSkill {
  isEnabled: boolean;
  activationDate: string;
  isSkill: boolean;
  displayName: string;
  learningOutcomeId: number;
  id?: number;
  easyStudentsCount: number;
  hardStudentsCount: number;
  meduimStudentsCount: number;
  numberOfSkills?: number;
}
export class SingleSkillPagination extends PaginationFilter {
  learningOutcomes: SingleSkill[];
}

export class SingleSkillPayload extends PaginationFilter {
  courseSectionId: number;
  domainId: number;
  curriculumLearningOutcomeId: number;
}
