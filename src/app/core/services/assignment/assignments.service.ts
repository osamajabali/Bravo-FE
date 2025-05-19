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

  getAssignments = (assignmentsPayload : AssignmentsPayload): Observable<Result<AssignmentResponse>> => {
    return this.apiHlpr.post<Result<AssignmentResponse>>(`assignment/assignments` , assignmentsPayload);
  }

  getAssignmentDetails = (assignmentId : number): Observable<Result<SubmissionStatus[]>> => {
    return this.apiHlpr.post<Result<SubmissionStatus[]>>(`assignment/assignment-detials-students-submission` , {assignmentId : assignmentId});
  }

  getAssignmentMainDetails = (assignmentId : number): Observable<Result<AssignmentDetails>> => {
    return this.apiHlpr.post<Result<AssignmentDetails>>(`assignment/assignment-main-details` , {assignmentId : assignmentId});
  }

  getStudentAssignmentDetails = (studentsAssignmentDetails : StudentsAssignmentDetails): Observable<Result<StudentAssignmentDetailsResponse>> => {
    return this.apiHlpr.post<Result<StudentAssignmentDetailsResponse>>(`assignment/assignment-details-students` , studentsAssignmentDetails);
  }
}
