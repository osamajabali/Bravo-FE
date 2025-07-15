export class SkillAssignmentSubmit {
  schoolId: number;
  subjectId: number;
  assignmentTypeId: number;
  recipientTypeId: string;
  selectedGrades: number[];
  selectedSections: number[];
  selectedGroups: number[];
  selectedStudents: number[];
  title: string;
  startDate: Date;
  dueDate: Date;
  isShowCorrectAnswer: boolean;
  isSameQuestionsForAllStudents: boolean;
  totalSelectedQuestions: number;
  selectedDomains: SkillAssignmentDomain[];
}

export class SkillAssignmentDomain {
  domainId: number;
  skills: SkillAssignmentSkill[];
}

export class SkillAssignmentSkill {
  skillId: number;
  totalBeginnerQuestions: number;
  totalMediumQuestions: number;
  totalAdvanceQuestions: number;
  customSelectedQuestions: number[];
} 