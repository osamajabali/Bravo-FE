import { PaginationFilter } from '../shared-models/pagination.model';

export interface LessonsCurriculums {
  curriculumLearningOutcomeId: number;
  lessonName?: string;
  skillsCount: number;
  name: string;
  domainName: any;
  id?:number;
}

export class LessonsCurriculumsPagination extends PaginationFilter {
  curriculums: LessonsCurriculums[];
}

export class LessonsCurriculumsPayload extends PaginationFilter {
  lessonId : number ;
  courseSectionId : number
}

export interface CurriculumWithActive extends LessonsCurriculums {
  isActive?: boolean;
}
