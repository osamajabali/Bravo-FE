import { PaginationFilter } from "../shared-models/pagination.model";

export interface Lessons {
    lessonId: number;
    lessonName: string
    sortOrder: number;
    skillsCount: number;
}

export class LessonsPagination extends PaginationFilter {
    lessons: Lessons[];
}
export class LessonsPayload extends PaginationFilter {
    unitId: number;
    courseSectionId : number;
}

export interface LessonWithActive extends Lessons {
    isActive?: boolean;
}
