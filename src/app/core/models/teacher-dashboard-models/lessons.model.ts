import { PaginationFilter } from "../shared-models/pagination.model";

export class Lessons {
    lessonId: number;
    lessonName: string
    sortOrder: number;
    skillsCount: number;
    isActive?: boolean;
}

export class LessonsPagination extends PaginationFilter {
    lessons: Lessons[];
}
export class LessonsPayload extends PaginationFilter {
    unitId: number;
    courseSectionId : number;
}