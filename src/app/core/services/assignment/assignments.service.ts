import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';
import { AssignmentFilter, AssignmentsPayload } from '../../models/assignment/assignment.model';
import { SectionFilter, SubjectGrade } from '../../models/assignment/sections-filter.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor(private apiHlpr: HttpService) { }


  getAssignmentFilters = (): Observable<Result<AssignmentFilter>> => {
    return this.apiHlpr.post<Result<AssignmentFilter>>(`assignment/assignment-filters` , null);
  }

  getAssignmentTypes = (subjectId : number): Observable<Result<{assignmentTypeId : number , name : string}[]>> => {
    return this.apiHlpr.post<Result<{assignmentTypeId : number , name : string}[]>>(`assignment/assignment-types` , {subjectId : subjectId});
  }

  getAssignmentSectionFilters = (subjectGrade : SubjectGrade): Observable<Result<SectionFilter>> => {
    return this.apiHlpr.post<Result<SectionFilter>>(`assignment/assignment-section-filters` , subjectGrade);
  }

  getAssignments = (assignmentsPayload : AssignmentsPayload): Observable<Result<any[]>> => {
    return this.apiHlpr.post<Result<any[]>>(`assignment/assignments` , assignmentsPayload);
  }
}
