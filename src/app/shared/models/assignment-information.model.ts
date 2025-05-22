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
  grade: AssignmentGrade | null;
  section: AssignmentSection | null;
} 