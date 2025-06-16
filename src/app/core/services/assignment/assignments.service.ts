import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';
import { Assignment, AssignmentFilter, AssignmentResponse, AssignmentsPayload } from '../../models/assignment/assignment.model';
import { SectionFilter, SubjectGrade } from '../../models/assignment/sections-filter.model';
import { AssignmentDetails, StudentAssignmentDetailsResponse, StudentsAssignmentDetails, SubmissionStatus } from '../../models/assignment/assignment-details.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  controller : string = 'assignment';

  constructor(private apiHlpr: HttpService) { }


  getAssignmentFilters = (): Observable<Result<AssignmentFilter>> => {
    return this.apiHlpr.post<Result<AssignmentFilter>>(`${this.controller}/assignment-filters` , null);
  }

  getAssignmentTypes = (subjectId : number): Observable<Result<{assignmentTypeId : number , name : string}[]>> => {
    return this.apiHlpr.post<Result<{assignmentTypeId : number , name : string}[]>>(`${this.controller}/assignment-types` , {subjectId : subjectId});
  }

  getAssignmentSectionFilters = (subjectGrade : SubjectGrade): Observable<Result<SectionFilter>> => {
    return this.apiHlpr.post<Result<SectionFilter>>(`${this.controller}/assignment-section-filters` , subjectGrade);
  }

  getAssignments = (assignmentsPayload : AssignmentsPayload): Observable<Result<AssignmentResponse>> => {
    return this.apiHlpr.post<Result<AssignmentResponse>>(`${this.controller}/assignments` , assignmentsPayload);
  }

  getAssignmentDetails = (assignmentId : number): Observable<Result<SubmissionStatus[]>> => {
    return this.apiHlpr.post<Result<SubmissionStatus[]>>(`${this.controller}/assignment-detials-students-submission` , {assignmentId : assignmentId});
  }

  getAssignmentMainDetails = (assignmentId : number): Observable<Result<AssignmentDetails>> => {
    return this.apiHlpr.post<Result<AssignmentDetails>>(`${this.controller}/assignment-main-details` , {assignmentId : assignmentId});
  }

  getStudentAssignmentDetails = (studentsAssignmentDetails : StudentsAssignmentDetails): Observable<Result<StudentAssignmentDetailsResponse>> => {
    return this.apiHlpr.post<Result<StudentAssignmentDetailsResponse>>(`${this.controller}/assignment-details-students` , studentsAssignmentDetails);
  }
}
