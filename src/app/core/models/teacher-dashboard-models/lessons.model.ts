import { PaginationFilter } from "../shared-models/pagination.model";

export class Lessons {
    lessonId: number;
    name: string
    sortOrder: number;
    skillsCount: number;
    isEnabled?: boolean;
    activationDate: string;
}

export class LessonsPagination extends PaginationFilter {
    lessons: Lessons[];
}
export class LessonsPayload extends PaginationFilter {
    unitId: number;
    courseSectionId: number;
}