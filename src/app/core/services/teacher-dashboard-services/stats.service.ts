import { Injectable } from '@angular/core';
import { learningOutcomesStats, Stats, StatsRequest } from '../../models/teacher-dashboard-models/stats.model';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';


@Injectable({
  providedIn: 'root',
})
export class StatsService {

  constructor(private apiHlpr : HttpService) { }

  
    getStats = (obj: StatsRequest): Observable<Result<learningOutcomesStats>> => {
      return this.apiHlpr.post<Result<learningOutcomesStats>>(`home/learningoutcomes-stats`, obj);
    }
}
