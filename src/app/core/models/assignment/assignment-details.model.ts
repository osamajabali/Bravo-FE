import { PaginationFilter } from "../shared-models/pagination.model";

export class DetailSection {
  id: number;
  title: string;
  value: string;
}

export class ScoreDetail {
  id: number;
  title: string;
  value: number;
  color: string;
  isHighlighted: boolean;
}

export class AssignmentDetails {
  assignmentTitle: string;
  assignmentType: string;
  detailsSections: DetailSection[] = [];
  overAllAvgScore: string;
  scoresDetails: ScoreDetail[] = [];
}

export class SubmissionStatus {
  id: number;
  text: string;
  value: number;
  color: string;
  iconUrl: string;
}

export class StudentsAssignmentDetails extends PaginationFilter {
    assignmentId : number;
}


export class Action {
  id: number;
  value: string;
  color: string;

  constructor(data: { id: number; value: string; color: string }) {
    this.id = data.id;
    this.value = data.value;
    this.color = data.color;
  }
}

export class StudentSubmissionStatus {
  id: number;
  title: string;
  color: string;
}

export class StudentAssignmentDetailsRespone {
  id: number;
  studentId: number;
  studentName: string;
  actions: Action[];
  correctScore: number;
  wrongScore: number;
  hasWarning: boolean;
  submissionStatus: StudentSubmissionStatus;
  color: string;
  title: string;
  timeSpent: string;
  totalScore: string;
  warningIconUrl: string | null;
}

export class StudentAssignmentDetailsResponse extends PaginationFilter{
    studentsDetails : StudentAssignmentDetailsRespone[];
}