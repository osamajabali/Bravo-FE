import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { SkillActivation } from '../../models/teacher-dashboard-models/skillsActivation.model';
import { QuickSkill } from '../../models/teacher-dashboard-models/semesters.model';

@Injectable({
  providedIn: 'root'
})
export class SkillActivationService {

  constructor(private apiHlpr: HttpService) { }

  activateLesson = (skillActivation: SkillActivation): Observable<Result<activationResponse>> => {
    return this.apiHlpr.post<Result<activationResponse>>(`skill-activation/by-lesson`, skillActivation);
  }

  activateCurriculum = (skillActivation: SkillActivation): Observable<Result<activationResponse>> => {
    return this.apiHlpr.post<Result<activationResponse>>(`skill-activation/by-curriculum`, skillActivation);
  }

  activateSkill = (skillActivation: SkillActivation): Observable<Result<activationResponse>> => {
    return this.apiHlpr.post<Result<activationResponse>>(`skill-activation/by-learning-outcome`, skillActivation);
  }

  quickActionActivation = (skillActivation: SkillActivation): Observable<Result<QuickSkill>> => {
    return this.apiHlpr.post<Result<QuickSkill>>(`skill-activation/by-quick-action`, skillActivation);
  }

  skipSkill = (skillActivation: SkillActivation): Observable<Result<QuickSkill>> => {
    return this.apiHlpr.post<Result<QuickSkill>>(`skill-activation/skip-skill`, skillActivation);
  }

}

export class activationResponse {
  isSuccess: boolean;
  activationDate: string
}
