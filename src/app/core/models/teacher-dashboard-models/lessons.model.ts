import { PaginationFilter } from "../shared-models/pagination.model";

export interface Lessons {
    lessonId: number;
    lessonName: string
    sortOrder: number;
}

export interface LessonsPagination extends PaginationFilter {
    lessons : Lessons[];
}