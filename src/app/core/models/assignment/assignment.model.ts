export class AssignmentFilter {
    recipientTypes: Array<{ recipientId: number, name: string }>;
    filterStatus: Array<{ id: number, name: string }>;
    filterSortBy: Array<{ id: number, name: string }>;
    filterOrders: Array<{ id: number, name: string }>;
}

export class AssignmentsPayload {
  subjectIds: number[] = [];
  gradeIds: number[] = [];
  courseSectionIds: number[] = [];
  assignmentTypeIds: number[] = [];
  assignmentStatuses: number[] = [];
  recipientId: number = 0;
  sortBy: number[] = [];
  order: number[] = [];
  isDateActive: boolean = false;
  startDate: string ;
  endDate: string ;
  creationDate: string ;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchValue: string = '';
}

