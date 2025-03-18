import { Injectable } from '@angular/core';
import { DomainRequest, learningOutcomesStats, Stats, StatsRequest } from '../../models/teacher-dashboard-models/stats.model';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { SkillsDomain } from '../../models/teacher-dashboard-models/main-skills.model';
import { Semester } from '../../models/teacher-dashboard-models/semesters.model';
import { SkillCurriculum } from '../../models/teacher-dashboard-models/skill-curriculum.model';


@Injectable({
  providedIn: 'root',
})
export class StatsService {

  constructor(private apiHlpr : HttpService) { }

  
    getStats = (obj: StatsRequest): Observable<Result<learningOutcomesStats>> => {
      return this.apiHlpr.post<Result<learningOutcomesStats>>(`home/learningoutcomes-stats`, obj);
    }
  
    getMainSkills = (obj: StatsRequest): Observable<Result<SkillsDomain>> => {
      return this.apiHlpr.post<Result<SkillsDomain>>(`home/domains`, obj);
    }
  
    getDomainSkills = (obj: DomainRequest): Observable<Result<SkillCurriculum[]>> => {
      return this.apiHlpr.post<Result<SkillCurriculum[]>>(`home/domains/skills`, obj);
    }
  
    getSemesters = (courseSectionId : number ): Observable<Result<Semester[]>> => {
      return this.apiHlpr.post<Result<Semester[]>>(`learning-outcomes/semesters`, {courseSectionId});
    }
}
