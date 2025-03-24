import { Injectable } from '@angular/core';
import { DomainRequest, learningOutcomesStats, Stats, StatsRequest } from '../../models/teacher-dashboard-models/stats.model';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { Skills, SkillsDomain } from '../../models/teacher-dashboard-models/main-skills.model';
import { Semester } from '../../models/teacher-dashboard-models/semesters.model';
import { SkillCurriculum, SkillCurriculumPagination, SkillCurriculumResponse } from '../../models/teacher-dashboard-models/skill-curriculum.model';


@Injectable({
  providedIn: 'root',
})
export class StatsService {

  constructor(private apiHlpr : HttpService) { }

  
    getStats = (obj: StatsRequest): Observable<Result<learningOutcomesStats>> => {
      return this.apiHlpr.post<Result<learningOutcomesStats>>(`home/learningoutcomes-stats`, obj);
    }
  
    getMainSkills = (obj: StatsRequest): Observable<Result<Skills[]>> => {
      return this.apiHlpr.post<Result<Skills[]>>(`home/domains`, obj);
    }
  
    getDomainSkills = (obj: DomainRequest): Observable<Result<SkillCurriculumPagination>> => {
      return this.apiHlpr.post<Result<SkillCurriculumPagination>>(`home/domains/skills`, obj);
    }
  
    getSemesters = (courseSectionId : number ): Observable<Result<Semester[]>> => {
      return this.apiHlpr.post<Result<Semester[]>>(`semesters`, {courseSectionId});
    }
}
