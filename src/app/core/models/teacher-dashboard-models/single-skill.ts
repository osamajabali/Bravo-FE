import { PaginationFilter } from '../shared-models/pagination.model';

export interface SingleSkill {
  activationDate: string;
  isSkill: boolean;
  learningOutcomeDisplayName: string;
  learningOutcomeId: number;
  noOfStudentsEasy: number;
  noOfStudentsHard: number;
  noOfStudentsMedium: number;
  isActive?: boolean;
}
export interface SingleSkillPagination extends PaginationFilter {
  learningOutcomes: SingleSkill[];
}
