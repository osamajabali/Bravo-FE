import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Result } from '../../models/shared-models/result';
import { Observable } from 'rxjs';
import { UnitPayload, UnitsPagination } from '../../models/teacher-dashboard-models/units.model';
import { LessonsPagination, LessonsPayload } from '../../models/teacher-dashboard-models/lessons.model';
import { LessonsCurriculumsPagination, LessonsCurriculumsPayload } from '../../models/teacher-dashboard-models/lesson-curriculums.model';
import { SingleSkillPagination } from '../../models/teacher-dashboard-models/single-skill';
import { Level, LevelPagination } from '../../models/teacher-dashboard-models/students.model';
import { SharedService } from '../shared-services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LearningOutcomesService {

  constructor(private apiHlpr: HttpService, private sharedService : SharedService) { }

  getUnits = (unitPayload : UnitPayload) : Observable<Result<UnitsPagination>> => {
    return this.apiHlpr.post<Result<UnitsPagination>>(`semesters/units`, unitPayload);
  }

  getUnitsLessons = (lessonsPayload : LessonsPayload) : Observable<Result<LessonsPagination>> => {
    return this.apiHlpr.post<Result<LessonsPagination>>(`semesters/units/lessons`, lessonsPayload);
  }

  lessonsCurriculums = (lessonsCurriculumsPayload : LessonsCurriculumsPayload) : Observable<Result<LessonsCurriculumsPagination>> => {
    return this.apiHlpr.post<Result<LessonsCurriculumsPagination>>(`semesters/units/lessons/curriculums`,lessonsCurriculumsPayload);
  }

  lessonsCurriculumsSkills = (courseSectionId : number , domainId : number ,curriculumLearningOutcomeId : number ) : Observable<Result<SingleSkillPagination>> => {
    return this.apiHlpr.post<Result<SingleSkillPagination>>(`semesters/units/lessons/curriculums/skills`, {courseSectionId : courseSectionId , domainId : domainId , curriculumLearningOutcomeId : curriculumLearningOutcomeId , pageSize : this.sharedService.pagination.pageSize});
  }

  getStudents = (courseSectionId : number , learningOutcomeId : number ) : Observable<Result<LevelPagination>> => {
    return this.apiHlpr.post<Result<LevelPagination>>(`semesters/units/lessons/curriculums/skills/students`, {courseSectionId : courseSectionId , learningOutcomeId : learningOutcomeId });
  }
}
