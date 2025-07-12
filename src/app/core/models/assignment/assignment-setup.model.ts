import { AssignmentRecipientTypes } from "./assignment-types.model";

export class AssignmentSetup {
  selectedGrades: number[] = [];
  selectedSections: number[] = [];
  selectedStudents: number[] = [];
  selectedGroups: number[] = [];
  dueDate: Date = new Date();
  startDate: Date = new Date();
  title: string;
  selectedGradesNames: string[];
  target: AssignmentRecipientTypes = new AssignmentRecipientTypes();
}

export class SchoolRoleSubject {
  schoolId: number;
  roleId: number;
  subjectId: number;
  gradeIds: number[];
}
