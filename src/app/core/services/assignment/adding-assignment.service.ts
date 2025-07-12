import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';
import { AssignmentRecipientTypes, AssignmentTypes } from '../../models/assignment/assignment-types.model';
import { AssignmentsDomain, AssignmentsDomainSkills, SkillsDomainResponse } from '../../models/assignment/assignment-domain.model';
import { AssignmentStories, StoryPaginationResponse } from '../../models/assignment/assignment-stories.model';
import { AssignmentPayload } from '../../models/assignment/assignment-payload';
import { AssignmentReading } from '../../models/assignment/assignment-reading.model';
import { SchoolRoleSubject } from '../../models/assignment/assignment-setup.model';

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

  getAssignmentGrades = (assignmentGrades: SchoolRoleSubject): Observable<Result<{ gradeId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ gradeId: number; name: string; }[]>>(`${this.controller}/add-assignment-grades`, assignmentGrades);
  }

  getAssignmentSections = (SchoolRoleSubject : SchoolRoleSubject): Observable<Result<{ courseSectionId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ courseSectionId: number; name: string; }[]>>(`${this.controller}/add-assignment-sections`, SchoolRoleSubject);
  }

  getAssignmentGroups = (assignmentGrades : SchoolRoleSubject): Observable<Result<{ groupId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ groupId: number; name: string; }[]>>(`${this.controller}/add-assignment-groups`, assignmentGrades);
  }

  getAssignmentStudents = (sectionIds: number[]): Observable<Result<{ studentId: number; fullName: string; }[]>> => {
    return this.apiHlpr.post<Result<{ studentId: number; fullName: string; }[]>>(`${this.controller}/add-assignment-students`, { courseSectionIds: sectionIds });
  }

  getAssignmentDomains = (assignmentsDomain : AssignmentsDomain): Observable<Result<{ domainId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ domainId: number; name: string; }[]>>(`${this.controller}/add-assignment-domains`, assignmentsDomain);
  }

  getAssignmentDomainsSkills = (assignmentsDomainSkills : AssignmentsDomainSkills): Observable<Result<SkillsDomainResponse>> => {
    return this.apiHlpr.post<Result<SkillsDomainResponse>>(`${this.controller}/add-assignment-skills`, assignmentsDomainSkills);
  }

  getAssignmentReadingSublevels = (): Observable<Result<{ readingSubLevelId: number; name: string; }[]>> => {
    return this.apiHlpr.post<Result<{ readingSubLevelId: number; name: string; }[]>>(`${this.controller}/add-assignment-reading-sub-levels`, null);
  }

  getAssignmentStories = (assignmentStories : AssignmentStories): Observable<Result<StoryPaginationResponse>> => {
    return this.apiHlpr.post<Result<StoryPaginationResponse>>(`${this.controller}/add-assignment-stories`, assignmentStories);
  }

  addAssignment = (assignment : AssignmentPayload): Observable<Result<{isSuccess : boolean}>> => {
    return this.apiHlpr.post<Result<{isSuccess : boolean}>>(`${this.controller}/add-skill-assignment`, assignment);
  }

  addAssignmentReading = (assignmentReading : AssignmentReading): Observable<Result<{isSuccess : boolean}>> => {
    return this.apiHlpr.post<Result<{isSuccess : boolean}>>(`${this.controller}/add-reading-comprehension-assignment`, assignmentReading);
  }

  addAssignmentOralReading = (assignmentOralReading : AssignmentReading): Observable<Result<{isSuccess : boolean}>> => {
    return this.apiHlpr.post<Result<{isSuccess : boolean}>>(`${this.controller}/add-oral-reading-assignment`, assignmentOralReading);
  }

  addAssignmentListeningReading = (assignmentOralReading : AssignmentReading): Observable<Result<{isSuccess : boolean}>> => {
    return this.apiHlpr.post<Result<{isSuccess : boolean}>>(`${this.controller}/add-listening-assignment`, assignmentOralReading);
  }

}

