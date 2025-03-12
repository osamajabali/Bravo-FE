import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Result } from '../../models/shared-models/result';
import { Observable } from 'rxjs';
import { Unit } from '../../models/teacher-dashboard-models/units.model';
import { Lessons } from '../../models/teacher-dashboard-models/lessons.model';
import { LessonsCurriculums } from '../../models/teacher-dashboard-models/lesson-curriculums.model';
import { SingleSkill } from '../../models/teacher-dashboard-models/single-skill';
import { Level } from '../../models/teacher-dashboard-models/students.model';

@Injectable({
  providedIn: 'root'
})
export class LearningOutcomesService {

  constructor(private apiHlpr: HttpService) { }

  getUnits = (id : number) : Observable<Result<Unit[]>> => {
    return this.apiHlpr.post<Result<Unit[]>>(`learning-outcomes/units`, {courseSectionId : id});
  }

  getUnitsLessons = (id : number) : Observable<Result<Lessons[]>> => {
    return this.apiHlpr.post<Result<Lessons[]>>(`learning-outcomes/units/lessons`, {unitId : id});
  }

  lessonsCurriculums = (id : number) : Observable<Result<LessonsCurriculums[]>> => {
    return this.apiHlpr.post<Result<LessonsCurriculums[]>>(`learning-outcomes/units/lessons/curriculums`, {lessonId  : id});
  }

  lessonsCurriculumsSkills = (courseSectionId : number , domainId : number ,curriculumLearningOutcomeId : number ) : Observable<Result<SingleSkill[]>> => {
    return this.apiHlpr.post<Result<SingleSkill[]>>(`learning-outcomes/units/lessons/curriculums/skills`, {courseSectionId : courseSectionId , domainId : domainId , curriculumLearningOutcomeId : curriculumLearningOutcomeId});
  }

  getStudents = (courseSectionId : number , learningOutcomeId : number ) : Observable<Result<Level[]>> => {
    return this.apiHlpr.post<Result<Level[]>>(`learning-outcomes/students`, {courseSectionId : courseSectionId , learningOutcomeId : learningOutcomeId });
  }
}
