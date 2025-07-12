import { PaginationFilter } from "../shared-models/pagination.model";

export class AssignmentsDomain {
  schoolId: number;
  roleId: number;
  subjectId: number;
  selectedGrades: number[];
  selectedCourseSections: number[];
  selectedGroups: number[];
  selectedStudents: number[];
}

export class AssignmentsDomainSkills {
  schoolId: number;
  roleId: number;
  subjectId: number;
  domainId: number;
  selectedGrades: number[];
  selectedCourseSections: number[];
  selectedGroups: number[];
  selectedStudents: number[];
}

export class SkillsDomain {
    advanceQuestionsCount: number;
    beginnerQuestionsCount: number;
    intermediateQuestionsCount: number;
    learningOutcomeId: number;
    name: string;
    beginnerValue : number = 0;
    intermediateValue : number = 0;
    advanceValue : number = 0;
}

export class SkillsDomainResponse {
    learningOutcomes : SkillsDomain[] = [];
}