import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';
import { AssignmentRecipientTypes, AssignmentTypes } from '../../models/assignment/assignment-types.model';
import { AssignmentsDomain, AssignmentsDomainSkills, SkillsDomainResponse } from '../../models/assignment/assignment-domain.model';

@Injectable({
  providedIn: 'root'
})
export class AddingAssignmentService {


  controller: string = 'assignment';

  constructor(private apiHlpr: HttpService) { }


  getAssignmenttypes = (): Observable<Result<AssignmentTypes[]>> => {
    return this.apiHlpr.post<Result<AssignmentTypes[]>>(`${this.controller}/assignment-types-add`, null);
  }

  getAssignmentRecipientTypes = (): Observable<Result<AssignmentRecipientTypes[]>> => {
    return this.apiHlpr.post<Result<AssignmentRecipientTypes[]>>(`${this.controller}/assignment-recipient-types-add`, null);
  }

  getAssignmentGrades = (subjectId: number): Observable<Result<{ gradeId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ gradeId: number; name: string; }[]>>(`${this.controller}/add-assignment-grades`, { subjectId: subjectId });
  }

  getAssignmentSections = (subjectId: number, gradeIds: number[]): Observable<Result<{ sectionId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ sectionId: number; name: string; }[]>>(`${this.controller}/add-assignment-sections`, { subjectId: subjectId, gradeIds: gradeIds });
  }

  getAssignmentGroups = (subjectId: number, gradeIds: number[]): Observable<Result<{ groupId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ groupId: number; name: string; }[]>>(`${this.controller}/add-assignment-groups`, { subjectId: subjectId, gradeIds: gradeIds });
  }

  getAssignmentStudents = (sectionIds: number[]): Observable<Result<{ studentId: number; fullName: string; }[]>> => {
    return this.apiHlpr.post<Result<{ studentId: number; fullName: string; }[]>>(`${this.controller}/add-assignment-students`, { sectionIds: sectionIds });
  }

  getAssignmentDomains = (assignmentsDomain : AssignmentsDomain): Observable<Result<{ domainId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ domainId: number; name: string; }[]>>(`${this.controller}/add-assignment-domains`, assignmentsDomain);
  }

  getAssignmentDomainsSkills = (assignmentsDomainSkills : AssignmentsDomainSkills): Observable<Result<SkillsDomainResponse>> => {
    return this.apiHlpr.post<Result<SkillsDomainResponse>>(`${this.controller}/add-assignment-skills`, assignmentsDomainSkills);
  }

}

