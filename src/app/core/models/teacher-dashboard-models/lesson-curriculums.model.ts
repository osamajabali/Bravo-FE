import { PaginationFilter } from '../shared-models/pagination.model';

export class LessonsCurriculums {
  curriculumLearningOutcomeId: number;
  lessonName?: string;
  skillsCount: number;
  name: string;
  domainName: any;
  id?:number;
  isActive?: boolean;
}

export class LessonsCurriculumsPagination extends PaginationFilter {
  curriculums: LessonsCurriculums[];
}

export class LessonsCurriculumsPayload extends PaginationFilter {
  lessonId : number ;
  courseSectionId : number
}

