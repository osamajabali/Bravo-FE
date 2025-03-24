import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { SharedService } from '../shared-services/shared.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { SkillActivation } from '../../models/teacher-dashboard-models/skillsActivation.model';

@Injectable({
  providedIn: 'root'
})
export class SkillActivationService {

  constructor(private apiHlpr: HttpService, private sharedService : SharedService) { }

  activateLesson = (skillActivation : SkillActivation) : Observable<Result<boolean>> => {
    return this.apiHlpr.post<Result<boolean>>(`skill-activation/by-lesson`, skillActivation);
  }

  activateCurriculum = (skillActivation : SkillActivation) : Observable<Result<boolean>> => {
    return this.apiHlpr.post<Result<boolean>>(`skill-activation/by-curriculum`, skillActivation);
  }

  activateSkill = (skillActivation : SkillActivation) : Observable<Result<boolean>> => {
    return this.apiHlpr.post<Result<boolean>>(`skill-activation/by-learning-outcome`, skillActivation);
  }
  
}
