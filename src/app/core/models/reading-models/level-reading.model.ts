import { PaginationFilter } from "../shared-models/pagination.model";

export class LevelReading extends PaginationFilter {
    readingMainLevelId: number = 0;
    courseSectionId: number = 0;
}

export class SubLevelStudents extends PaginationFilter {
    readingSubLevelId: number = 0;
    courseSectionId: number = 0;
}

export class SubLevelStudentsResponse extends PaginationFilter{
    studentId : number;
    fullName : string;
}

export class SubLevelStudentsResponseArray {
    students : SubLevelStudentsResponse[];
    studentsCount : number;
}

export class SubLevelReading extends PaginationFilter {
    readingSubLevelId: number = 0;
}
