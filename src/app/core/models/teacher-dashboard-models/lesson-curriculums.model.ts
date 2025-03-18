import { PaginationFilter } from '../shared-models/pagination.model';

export interface LessonsCurriculums {
  curriculumLearningOutcomeId: number;
  nameArabic: string;
  lessonName?: string;
  skillsCount: number;
}

export interface LessonsCurriculumsPagination extends PaginationFilter {
  curriculums: LessonsCurriculums[];
}

export interface CurriculumWithActive extends LessonsCurriculums {
  isActive?: boolean;
}
