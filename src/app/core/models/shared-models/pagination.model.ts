export class PaginationFilter {
    pageNumber: number = 1;
    pageSize: number = 3;
    totalRecords: number;
    totalPages: number;
    sortColumn: string;
    sortColumnDirection: string;
    searchValue: string;
}