import { PaginationFilter } from "../shared-models/pagination.model";

export class AssignmentFilter {
  recipientTypes: Array<{ recipientId: number, name: string }>;
  filterStatus: Array<{ id: number, name: string }>;
  filterSortBy: Array<{ id: number, name: string }>;
  filterOrders: Array<{ id: number, name: string }>;
}

export class AssignmentsPayload {
  subjectId: number = 0;
  gradeIds: number[] = [];
  courseSectionIds: number[] = [];
  assignmentTypeIds: number[] = [];
  assignmentStatuses: number[] = [];
  recipientId: number = 0;
  sortBy: number = 0;
  order: number = 0;
  isDateActive: boolean = false;
  startDate: string;
  endDate: string;
  creationDate: string;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchValue: string = '';
}

export class Assignment {
  assignmentId: number;
  title: string;
  isScheduled: boolean;
  avgScore: string;
  submission: string;
  target: string;
  startDate: Date;
  endDate: Date;
  assignedBy: string;
  status: string;
}
export class AssignmentResponse extends PaginationFilter {
  assignments: Assignment[] = [];
}