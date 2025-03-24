import { PaginationFilter } from '../shared-models/pagination.model';

export class SingleSkill {
  isEnabled: boolean;
  activationDate: string;
  isSkill: boolean;
  learningOutcomeDisplayName: string;
  learningOutcomeId: number;
  id?: number;
  noOfStudentsEasy: number;
  noOfStudentsHard: number;
  noOfStudentsMedium: number;
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
