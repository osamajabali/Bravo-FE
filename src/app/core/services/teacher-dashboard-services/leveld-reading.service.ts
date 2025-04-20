import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { ReadingFilter } from '../../models/reading-models/reading-filter.model';
import { MainLevels } from '../../models/reading-models/main-levels';
import { DetailedFilter } from '../../models/reading-models/detailed-filter.model';
import { LevelReading, SubLevelReading, SubLevelStudents, SubLevelStudentsResponseArray } from '../../models/reading-models/level-reading.model';
import { LevelReadingResponse, LevelReadingResponseArray } from '../../models/reading-models/level-reading-response.model';
import { SublevelReadingResponse } from '../../models/reading-models/sub-level-reading.model';
import { StoryPageResponseArray, StoryPages, StorySummarry } from '../../models/reading-models/story-summary.model';
import { StoryDetails } from '../../models/reading-models/story-details.model';
import { QuestionsResponse } from '../../models/reading-models/questions.model';

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

  getLevelReading = (levelReading : LevelReading) : Observable<Result<LevelReadingResponseArray>> => {
    return this.apiHlpr.post<Result<LevelReadingResponseArray>>(`library/level-reading` , levelReading);
  }

  getSubLevelReading = (subLevelReading : SubLevelReading) : Observable<Result<SublevelReadingResponse>> => {
    return this.apiHlpr.post<Result<SublevelReadingResponse>>(`library/sub-level-stories` , subLevelReading);
  }

  getSubLevelStudents = (subLevelReading : SubLevelStudents) : Observable<Result<SubLevelStudentsResponseArray>> => {
    return this.apiHlpr.post<Result<SubLevelStudentsResponseArray>>(`library/sub-level-students` , subLevelReading);
  }

  getStoryDetails = (storySummarry : StorySummarry) : Observable<Result<StoryDetails>> => {
    return this.apiHlpr.post<Result<StoryDetails>>(`library/story-summary` , storySummarry);
  }

  getQuestions = (storyQuestions : StorySummarry) : Observable<Result<QuestionsResponse>> => {
    return this.apiHlpr.post<Result<QuestionsResponse>>(`library/story-questions` , storyQuestions);
  }

  getStoryPages = (storyPages : StoryPages) : Observable<Result<StoryPageResponseArray>> => {
    return this.apiHlpr.post<Result<StoryPageResponseArray>>(`library/story-pages` , storyPages);
  }
}
