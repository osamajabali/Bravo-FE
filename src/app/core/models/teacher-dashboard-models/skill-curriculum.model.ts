import { PaginationFilter } from "../shared-models/pagination.model";

export interface SkillCurriculum {
    activationDate: string | null;
    name: string;
    id: number;
    learningOutcomeId? : number;
    isEnabled: boolean | null;
    isSkill: boolean;
    learningOutcomeDisplayName: string | null;
    noOfStudentsEasy: number;
    noOfStudentsHard: number;
    noOfStudentsMedium: number;
    skillsCount: number;
    isActive : boolean;
  }

  export class SkillCurriculumPagination extends PaginationFilter{
    learningOutcomes : SkillCurriculum[]
  }

  export interface SkillCurriculumResponse{
    learningOutcomes : SkillCurriculum[]
  }