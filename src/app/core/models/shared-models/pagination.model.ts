export class PaginationFilter {
    pageNumber: number = 1;
    pageSize: number = 4;
    totalRecords: number;
    totalPages: number;
    sortColumn: string;
    sortColumnDirection: string;
    searchValue: string;
}