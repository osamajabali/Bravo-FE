export class AssignmentReading {
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
  bookSelectionCriteria: number;
  selectedReadingSubLevelId: number;
  selectedBookId: number;
  correctionType: number;
}