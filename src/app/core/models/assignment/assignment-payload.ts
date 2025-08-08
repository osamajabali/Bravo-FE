import { SkillsDomain } from "./assignment-domain.model";

export class AssignmentPayload {
  schoolId: number;
  roleId: number;
  subjectId: number;
  assignmentTypeId: number;
  recipientTypeId: string;
  selectedGrades: number[];
  selectedCourseSections: number[];
  selectedGroups: number[];
  selectedStudents: number[];
  title: string;
  startDate: Date;
  dueDate: Date;
  isShowCorrectAnswer: boolean;
  isSameQuestionsForAllStudents: boolean;
  totalSelectedQuestions: number;
  selectedDomains: Domain[];
}

export class Domain {
  domainId: number;
  skills: SkillsDomain[];
}

