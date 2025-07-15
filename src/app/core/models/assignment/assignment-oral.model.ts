export class OralAssignmentPayload {
  schoolId: number;
  roleId: number;
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
  correctionType: number;
  selectedReadingSubLevelId: number;
  selectedBookId: number;
  selectedPagesId: number[];
}