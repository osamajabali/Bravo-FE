import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Statistics, StatisticsResponse } from '../../models/teacher-dashboard-models/statistics.model';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';

@Injectable({
  providedIn: 'root'
})
export class SkillsStatisticsService {

  constructor(private apiHlpr : HttpService) { }

    getStatistics = (statistics: Statistics): Observable<Result<StatisticsResponse[]>> => {
      return this.apiHlpr.post<Result<StatisticsResponse[]>>(`skills-statistics`, statistics);
    }
}
