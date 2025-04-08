import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { ReadingFilter } from '../../models/reading-models/reading-filter.model';
import { MainLevels } from '../../models/reading-models/main-levels';
import { DetailedFilter } from '../../models/reading-models/detailed-filter.model';

@Injectable({
  providedIn: 'root'
})
export class LeveldReadingService {

  constructor(private apiHlpr: HttpService) { }

  getMainLevels = () : Observable<Result<MainLevels[]>> => {
    return this.apiHlpr.post<Result<MainLevels[]>>(`library/main-levels` , null);
  }

  getSubLevels = (mainLevelId  : number) : Observable<Result<any>> => {
    return this.apiHlpr.post<Result<any>>(`library/sub-levels` , {mainLevelId});
  }

  getFilters = (readingMainLevelId  : number , readingSubLevelId  : number) : Observable<Result<DetailedFilter>> => {
    return this.apiHlpr.post<Result<DetailedFilter>>(`library/filters` , {readingMainLevelId , readingSubLevelId});
  }

  getStories = (readingFilter : ReadingFilter) : Observable<Result<any>> => {
    return this.apiHlpr.post<Result<any>>(`library/stories` , readingFilter);
  }
}
