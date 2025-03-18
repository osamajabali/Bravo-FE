import { PaginationFilter } from '../shared-models/pagination.model';

export interface SingleSkill {
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
export interface SingleSkillPagination extends PaginationFilter {
  learningOutcomes: SingleSkill[];
}
