export class PaginationFilter {
    pageNumber: number = 1;
    pageSize: number = 5;
    totalRecords: number;
    totalPages: number;
    sortColumn: string;
    sortColumnDirection: string;
    searchValue: string;
}