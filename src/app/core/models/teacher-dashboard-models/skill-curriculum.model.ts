import { PaginationFilter } from "../shared-models/pagination.model";

export interface SkillCurriculum {
    activationDate: string | null;
    name: string;
    id: number;
    skillName : string;
    learningOutcomeId? : number;
    isEnabled: boolean | null;
    isSkill: boolean;
    domainName: string ;
    easyStudentsCount: number;
    hardStudentsCount: number;
    meduimStudentsCount: number;
    skillsCount: number;
    isActive : boolean;
  }

  export class SkillCurriculumPagination extends PaginationFilter{
    learningOutcomes : SkillCurriculum[]
  }

  export interface SkillCurriculumResponse{
    learningOutcomes : SkillCurriculum[]
  }