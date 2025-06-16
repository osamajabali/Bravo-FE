import { PaginationFilter } from "../shared-models/pagination.model";

export class AssignmentsDomain {
  subjectId: number;
  selectedGrades: number[];
  selectedSections: number[];
  selectedGroups: number[];
  selectedStudents: number[];
}

export class AssignmentsDomainSkills {
  subjectId: number;
  domainId: number;
  selectedGrades: number[];
  selectedSections: number[];
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

export class SkillsDomainResponse extends PaginationFilter {
    learningOutcomes : SkillsDomain[] = [];
}