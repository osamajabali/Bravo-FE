export interface AssignmentTarget {
  id: number;
  name: string;
}

export interface AssignmentGrade {
  id: number;
  name: string;
}

export interface AssignmentSection {
  id: number;
  name: string;
}

export interface AssignmentInformation {
  target: AssignmentTarget | null;
  grade?: AssignmentGrade | null;
  section?: AssignmentSection | null;
  title: string | null;
  startDate: Date | null;
  dueDate: Date | any;
  homeroom?: { id: number; name: string } | null;
  group?: { id: number; name: string } | null;
  student?: Array<{ id: number; name: string }> | null;
}
