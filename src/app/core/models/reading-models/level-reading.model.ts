import { PaginationFilter } from "../shared-models/pagination.model";

export class LevelReading extends PaginationFilter {
    readingMainLevelId: number = 0;
    courseSectionId: number = 0;
}

export class SubLevelReading extends PaginationFilter {
    readingSubLevelId: number = 0;
}
