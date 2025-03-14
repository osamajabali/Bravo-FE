import { PaginationFilter } from "../shared-models/pagination.model";

export interface LessonsCurriculums {
    curriculumLearningOutcomeId: number;
    nameArabic: string;
}

export interface LessonsCurriculumsPagination extends PaginationFilter {
    curriculums : LessonsCurriculums[]
}