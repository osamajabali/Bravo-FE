export class AssignmentReading {
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
  bookSelectionCriteria: number;
  selectedReadingSubLevelId: number;
  selectedBookId: number;
}