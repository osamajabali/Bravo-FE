import { PaginationFilter } from "../shared-models/pagination.model";

export interface Lessons {
    lessonId: number;
    lessonName: string
    sortOrder: number;
    skillsCount: number;
}

export interface LessonsPagination extends PaginationFilter {
    lessons: Lessons[];
}

export interface LessonWithActive extends Lessons {
    isActive?: boolean;
}
